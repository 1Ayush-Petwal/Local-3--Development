const { ethers, run, network } = require("hardhat")
require("dotenv")

async function main() {
    const factory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract .... ")
    const contract = await factory.deploy();

    // Note: the contract.address is replaced with contract.target in the new version  
    console.log(`Contract target is ${contract.target}`)
    // console.log(network.config)

    // We don't need to verify the transaction on our local blockchain
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting of blocks txs....");
        await contract.deploymentTransaction().wait(6);  // padding time for deployment 
        await verify(contract.target, []);
    }


    // basic functionality of the contract
    const currectValue = await contract.reterive();
    console.log(`Current value is ${currectValue}`)

    const transactionResp = await contract.store(7);
    await transactionResp.wait(1);
    const updatedValue = await contract.reterive();

    console.log(`Updated Value is ${updatedValue}`);

}

async function verify(contractAddress, args) {
    console.log("Verfying Contract....");
    try {
        // Using the run command we can call any other hardhat script 
        await run("verify:verify", {
            address: contractAddress,
            constructorAgruments: args
        })
    } catch (error) {  // when the contract is already verified then --> error might occur 
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified !!!")
        }else {
            console.log(e)
        }
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })