const { ethers, network } = require("hardhat")
const { deployments, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe staging tests', function () {
        let fundMe;
        let deployer;
        const sendValue = ethers.parseEther("0.1");
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract("FundMe", deployer);
        })


        it("allows people to fund and withdraw", async function () {
            const fundTxResponse = await fundMe.fund({ value: sendValue })
            await fundTxResponse.wait(1)
            const withdrawTxResponse = await fundMe.withdraw()
            await withdrawTxResponse.wait(1)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            console.log(
                endingFundMeBalance.toString() +
                " should equal 0, running assert equal..."
            )
            assert.equal(endingFundMeBalance.toString(), "0")
        })
    }
    )