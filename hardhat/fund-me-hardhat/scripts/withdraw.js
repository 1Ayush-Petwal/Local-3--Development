const { getNamedAccounts, ethers } = require("hardhat")


// to withdraw the funds from a contract
async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log(`Got contract FundMe at ${fundMe.target}`)
    console.log("withdrawing...")
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait(1);
    console.log("Got it back!")
}

main().then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }) 