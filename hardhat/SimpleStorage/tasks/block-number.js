const {task}  =  require("hardhat/config")


task("block-number","Prints the current block number on the chain").setAction(
    
    //######## Arrow Function Vs Normal Function ###########
    // const blockTask = async function() => {}
    // async function blockTask() {}
    /// ####### Both the above function defination are Equivalent ############
    
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNumber}`)
    }
)
module.exports = {}