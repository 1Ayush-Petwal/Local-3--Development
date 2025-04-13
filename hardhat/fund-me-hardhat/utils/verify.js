const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verfying Contract....");
    try {
        // Using the run command we can call any other hardhat script 
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (error) {  // when the contract is already verified then --> error might occur 
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified !!!")
        } else {
            console.log(error)
        }
    }
}

module.exports = { verify }
