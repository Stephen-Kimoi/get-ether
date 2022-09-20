// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17; 

import "hardhat/console.sol"; 

contract WavePortal {
    uint256 totalWaves; 

    constructor() {
        console.log("Yo! I am a contract and I am smart"); 
    } 

    function wave() public {
        totalWaves += 1; 
        console.log("%s has waved!", msg.sender); 
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %s total waves", totalWaves); 
        return totalWaves; 
    } 
}