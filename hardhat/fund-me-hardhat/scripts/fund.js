const {
    getNamedAccounts,
    ethers
} = require("hardhat")

// For funding the contract on any chain
async function main() {
    const { deployer } = await getNamedAccounts()
    console.log("Getting the mock contract for testing....")
    const mockV3Aggr = await ethers.getContract("MockV3Aggregator", deployer)
    console.log("Getting the contract.... ")

    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("Funding....")
    const transactionResponse = await fundMe.fund({
        value: ethers.parseEther("0.1")
    })
    await transactionResponse.wait(1);
    console.log("Funded!!!");
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })