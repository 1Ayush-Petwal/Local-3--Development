// AIM:
// Get funds from the users
// Withdraw funds
// Set Minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {PriceConverter} from "./PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

error FundMe__notOwner();

/**@title A sample Funding Contract
 * @author Ayush Petwal
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */

contract FundMe {
    // all the uint256 can use the library PriceConvertor
    using PriceConverter for uint256;

    uint256 constant MIN_USD = 5e18;
    address private immutable i_owner;

    // i_var --> immutable variable
    // s_var --> Refers to the variable in the persistant storage
    address[] private s_funders;
    mapping(address funder => uint256 amountFunded)
        public s_addressToAmountFunded;

    AggregatorV3Interface public s_priceFeed;

    constructor(address s_priceFeedAddr) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddr);
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Must be owner !!!");
        // Gas Optimised
        if (msg.sender != i_owner) {
            revert FundMe__notOwner();
        }
        _; // After checking then execute the function
    }

    function gets_priceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MIN_USD,
            "didn't have enough eth"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    // require(bool condition) :->
    // -> reverts if the condition is not met - to be used for errors in inputs or external components.
    // what is a revert ?
    // Undo any actions that have been done, and send the remaining gas back !!!

    function withdraw() public onlyOwner {
        // Only allow the owner to withdraw the funds
        // Two ways 1) require  2) modifier
        // require(msg.sender == owner, "Must be owner to withdraw !!!");
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reseting the array <- Creating a new address array object
        s_funders = new address[](0);

        (bool callStatus, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callStatus, "Call failed !!!");
    }

    // Getters for each private variable
    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
    // similarly for the rest of the private vaiables if any
}
// Getting the Global special variables
// https://docs.soliditylang.org/en/v0.8.29/units-and-global-variables.html
