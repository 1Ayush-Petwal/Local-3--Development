// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // Getting real time Data from the data feeds
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // Interacting with the contract we need two things
        // Address 0x694AA1769357215DE4FAC081bf1f309aDC325306
        // ABI (Interface of functions )
        (, int256 price, , , ) = priceFeed.latestRoundData();

        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // ethAmount = 1e18
        // ethPrice = 2000e18
        // ethAmountinUSD = 2000
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountinUSD = (ethAmount * ethPrice) / 1e18;
        return ethAmountinUSD;
    }
}
