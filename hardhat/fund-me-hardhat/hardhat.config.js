require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers")
require('hardhat-deploy');
require('dotenv').config()


/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINCAP_API_KEY = process.env.COINMARKET_CAP_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.28" }, { version: "0.8.8" }, { version: "0.8.7" }]
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  networks: {
    hardhat: {
      chainId: 31337, // Default Hardhat network
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 4,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};
