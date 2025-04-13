const networkConfig = {
    11155111: {
        name: 'Sepolia',
        ethUsdPrice: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    300: {
        name: 'zkSync-sepolia',
        ethUsdPrice: '0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF'
    }
}

const developmentChains = ["hardhat", "localhost"]

const DECIMALS = "8"
const INIT_ANSWER = "200000000000" // 2000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INIT_ANSWER
}