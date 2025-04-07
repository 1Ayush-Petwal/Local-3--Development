require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomicfoundation/hardhat-verify");
require("./tasks/block-number")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL 
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY 
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    locahost: { 
      url: "http://127.0.0.1:8545/",
      // defaulty gives the accounts, as it is on top of hardhat network 
      chainId: 31337
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  solidity: "0.8.28",
};
