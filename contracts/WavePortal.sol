// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17; 

import "hardhat/console.sol"; 

contract WavePortal {
    uint256 totalWaves; 
    // mapping (address => uint) public  

    uint256 private seed; 

    event NewWave(address indexed from, uint256 timestamp, string message); 

    struct Wave {
        address waver; 
        string message; 
        uint256 timestamp; 
    }

    Wave[] waves; 

    constructor() payable {
        console.log("Yo! I am a contract and I am smart"); 
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1; 
        console.log("%s waved w/ message %s", msg.sender, _message); 

        waves.push(Wave(msg.sender,_message,block.timestamp)); 

        seed = (block.difficulty + block.timestamp + seed) % 100; 

        console.log("Randomly generated seed: %d", seed); 

        if (seed < 50) {
            console.log("%s won!", msg.sender); 
            
            uint256 prizeAmount = 0.0001 ether; 
            require(
            prizeAmount <= address(this).balance, 
            "Insufficient funds in your contract to give a prize!"
            ); 
            (bool success, ) = (msg.sender).call{value: prizeAmount}(""); 
            require(success, "Opps! Failed to withdraw money from the smart contract");
        }

        emit NewWave(msg.sender,block.timestamp,_message);

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