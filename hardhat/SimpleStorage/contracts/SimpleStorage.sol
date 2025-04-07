// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

//on Compiling the contract, It boils down to EVM (Ethereum Virtual Machine) instructions
//Avalanche, Fantom, and Polygon

contract SimpleStorage {
    //Data Types : bool, int , uint, address, bytes
    //Visiblity types : public, private, internal, external
    //Default visibilty is internal

    uint favNum = 0; // uint is special in the sense that we can specify the amount of bytes it can take
    // Default is uint256. --> 256 bits storage that is 32 byte storage
    // Same thing is true for int and bytes data type
    int256 favnumber1 = 234;

    bytes32 favoriteByte = "cat";

    // There are default values given to the variables
    uint deafNum; // Default value. = 0

    //Every time a function updates the state of the blockchain
    //Gas will be costed
    function store(uint256 _favNum) public {
        favNum = _favNum;
    }

    //view, pure type functions;
    //Both these type of functions disallow the modification of state
    //view -> view the state of the blockchain
    //pure -> cannot even read from the blockchain
    //       just for implementing some algo or computational function
    //       does not require any storage in the blockchain

    function reterive() public view returns (uint256) {
        return favNum;
    }

    function add() public pure returns (uint32) {
        return (1 + 1);
    }

    //Note: If the gas costing function calls the pure and view
    //function. -> Only then will there be any gas cost

    // Both these are same
    // A varaible with the visiblity public acts in the same way
    // as a function with the view type to reterive a variable
    uint256 secNum;

    function getSec() public view returns (uint256) {
        return secNum;
    }

    // Custom Data Type
    struct People {
        uint256 FavNum;
        string name1;
    }

    // Array, if no fix size is given the arrays are dynamic
    // By Default
    People[] public persons;

    mapping(string => uint256) public nameToFav;

    // To add the custom elements Dynamically
    function addPeople(uint256 num, string memory name) public {
        People memory newPerson = People({FavNum: num, name1: name});
        persons.push(newPerson);

        nameToFav[name] = num;
    }
    // Data Locations
    //Memory, calldata, storage
    //These are different ways to acccess and store info
    //and the existence of the variables in the contract

    //storage -> variables that exist even outside the function
    // permanent variables
    // default to all the variables declared outside the function

    // calldata, memory are temporary existing variables declared as
    // arguments to a function

    // calldata variables are constants i.e. They are unassignable
    // memory are assignable, modifiable

    // Note: We need to put the memory only for struct, mappings
    // and arrays ( including string )

    // Mappings
}
// like The wallet the contract have there own address assigned to them
// 0xd9145CCE52D386f254917e481eB44e9943F39138
