const { assert, expect } = require("chai");
const { deployments, getNamedAccounts } = require("hardhat")
const { ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {

        let fundMe
        let deployer
        let mockV3Aggr;
        const sendValue = ethers.parseEther("1");
        beforeEach(async function () {
            // deploy our FundMe contract 
            // using hardhat-deploy
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])      // deploys all scripts with 'all' tag
            fundMe = await ethers.getContract("FundMe", deployer)
            mockV3Aggr = await ethers.getContract(
                "MockV3Aggregator", deployer
            );
        })

        // Making describe for each funciton in the contract 
        describe("constructor", function () {
            it("sets aggregator address correctly", async function () {
                const response = await fundMe.s_priceFeed();
                assert.equal(response, mockV3Aggr.target);
            })
        })

        describe("Fund", function () {
            it("Fails if enough eth is not send", async function () {
                await expect(fundMe.fund()).to.be.revertedWith("didn't have enough eth")
            })
            it("Updated the amount funded data structure", async function () {
                await fundMe.fund({ value: sendValue });
                const response = await fundMe.s_addressToAmountFunded(deployer);
                assert.equal(sendValue.toString(), response.toString());
            })
            it("Adds the funder to the array", async function () {
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.getFunder(0);
                assert.equal(funder, deployer);
            })
        })

        describe("Withdraw", function () {
            beforeEach(async function () {
                await fundMe.fund({ value: sendValue });
            })
            it("withdraw Eth from a single founder", async function () {
                // Arrange
                const startingFundMeBalance = await ethers.provider.getBalance(
                    fundMe.target
                );
                const startingDeployerBalance = await ethers.provider.getBalance(
                    deployer
                )
                // Act
                const transactResponse = await fundMe.withdraw();
                const transactReceipt = await transactResponse.wait(1);

                const { gasUsed, gasPrice } = transactReceipt;

                // Gas cost estimation of the transaction 
                const gasCost = gasUsed * gasPrice;
                const endingFundMeBalance = await ethers.provider.getBalance(
                    fundMe.target
                )
                const endingDeployerBalance = await ethers.provider.getBalance(
                    deployer
                )

                // Assert
                assert.equal(endingFundMeBalance, 0);
                assert.equal((startingDeployerBalance + startingFundMeBalance).toString(),
                    (endingDeployerBalance + gasCost).toString())
            })
            it("withdraw Eth from a multiple founder", async function () {
                // Arrange
                const accounts = await ethers.getSigners();

                for (let i = 1; i < 6; i++) {  // Connecting each account to the contract and funding
                    const fundeMeConnectedContract = await fundMe.connect(
                        accounts[i]
                    )
                    await fundeMeConnectedContract.fund({ value: sendValue });
                }
                const startingFundMeBalance = await ethers.provider.getBalance(
                    fundMe.target
                );
                const startingDeployerBalance = await ethers.provider.getBalance(
                    deployer
                )

                // Act
                const transactResponse = await fundMe.withdraw();
                const transactReceipt = await transactResponse.wait(1);

                const { gasUsed, gasPrice } = transactReceipt;

                const gasCost = gasUsed * gasPrice;
                const endingFundMeBalance = await ethers.provider.getBalance(
                    fundMe.target
                )
                const endingDeployerBalance = await ethers.provider.getBalance(
                    deployer
                )

                // Assert
                assert.equal(endingFundMeBalance, 0);
                assert.equal((startingDeployerBalance + startingFundMeBalance).toString(),
                    (endingDeployerBalance + gasCost).toString())

                // Make sure the getFunder array is reset properly 
                await expect(fundMe.getFunder(0)).to.be.reverted

                for (let i = 1; i < 6; i++) {
                    assert.equal(await fundMe.s_addressToAmountFunded(accounts[i]), 0)
                }
            })
            it("only allows the owner to withdraw", async function () {
                const accounts = await ethers.getSigners()
                const attacker = accounts[1];

                const attackerConnectedContract = await fundMe.connect(attacker);
                await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__notOwner")
            })
        })
    })