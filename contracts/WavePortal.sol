// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17; 

import "hardhat/console.sol"; 

contract WavePortal {
    uint256 totalWaves; 
    // mapping (address => uint) public  

    event NewWave(address indexed from, uint256 timestamp, string message); 

    struct Wave {
        address waver; 
        string message; 
        uint256 timestamp; 
    }

    Wave[] waves; 

    constructor() payable {
        console.log("Yo! I am a contract and I am smart"); 
    } 

    function wave(string memory _message) public {
        totalWaves += 1; 
        console.log("%s waved w/ message %s", msg.sender, _message); 

        waves.push(Wave(msg.sender,_message,block.timestamp)); 

        emit NewWave(msg.sender,block.timestamp,_message); 

        uint256 prizeAmount = 0.001 ether; 
        require(
           prizeAmount <= address(this).balance, 
           "Insufficient funds in your contract to give a prize!"
        ); 
        (bool success, ) = (msg.sender).call{value: prizeAmount}(""); 
        require(success, "Opps! Failed to withdraw money from the smart contract");

        console.log("%s has waved!", msg.sender); 
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves; 
    } 

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %s total waves", totalWaves); 
        return totalWaves; 
    } 
}