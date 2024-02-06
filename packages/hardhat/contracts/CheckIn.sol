// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./BatchRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CheckIn is Ownable {
    BatchRegistry private immutable registry;

    constructor(address _initialOwner, address payable _registryAddress) payable {
        super.transferOwnership(_initialOwner);
        registry = BatchRegistry(_registryAddress);
    }

    function checkMeIn() public onlyOwner {
        registry.checkIn();
    }
}
