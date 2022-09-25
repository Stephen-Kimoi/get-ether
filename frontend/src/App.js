import { ethers } from "hardhat";
import * as React from "react";
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading'; 
import { abi } from './utils/WavePortal.json'; 
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);  
  const [sucessfull, setSucessfull] = useState(false); 
  const [allWaves, setAllWaves] = useState([]); 

  const contractAddress = "0x1ad9d4269E0Ce5b4c30483244c261F31fbD5b6f5"; 
  const contractABI = abi.abi; 

  const wave = async () => {
    try {
      const { ethereum } = window; 

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 

        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer); 

        let count = await wavePortalContract.getTotalWaves(); 
        console.log("Retrieved total wave count: ", count.toNumber()); 

      } else {
        console.log("Ethereum object does not exist"); 
      }
    } catch (error) {
        console.log(error); 
    }
    console.log("Wave")
  }

  const checkIfWalletisConnected = async () => { 
    try {
      const { ethereum } = window; 

      if (!ethereum) {
        console.log("Make sure you have metamask!")
      } else {
        console.log("Ethereum from window object is found! ", ethereum)
      }

      // See if we have authorization to the users wallet 
      const accounts = await ethereum.request({method: "eth_accounts"}); 
      if (accounts.length !== 0){
        const account = accounts[0]; 

        console.log("Found an authorized account: ", account); 
        setCurrentAccount(account); 

      } else {
        console.log("No authorized account found"); 
      }
    } catch (error) {
        console.log(error)
    }
  } 

  const connectWallet = async () => {
    setLoading(true)
    try {
      const { ethereum } = window; 

      if(!ethereum){
        alert("Get Metamask!"); 
        return; 
      } 

      const accounts = await ethereum.request({method: "eth_requestAccounts"}); 

      console.log("Connected: ", accounts[0]); 
      setCurrentAccount(accounts[0]); 
      setLoading(false); 

    } catch(error) {
      console.log(error); 
      setLoading(false); 
    }

    setSucessfull(false)

    setTimeout( () => {
      setSucessfull(true); 
    }, 3000); 

    setSucessfull(false); 

  }

  useEffect( () => {
    checkIfWalletisConnected(); 
  }, [])

  // Function that gets all the waves 
  const getAllWaves = async () => {
    try {
      const { ethereum } = window; 
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 
        const WavePortalContract = new ethers.Contract(contractAddress, contractABI, signer); 

        // Calling getAllWaves() method from the smart contract 
        const waves = await WavePortalContract.getAllWaves(); 

        // Picking address, timestamp and message that will be shown in the UI
        let wavesCleaned = []; 
        waves.forEach( wave => {
          wavesCleaned.push({
            address: wave.waver, 
            timestamp: new Date(wave.timestamp * 1000), 
            message: wave.message
          }); 
        }); 
        // Store the data in react state 
        setAllWaves(wavesCleaned); 
      } else {
        console.log("Ethereum objec does not exist")
      }
    } catch (error) {
        console.log(error)
    }
  }

  const wavesDisplay = allWaves.map( (wave, index) => {
    return (
      <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
          <div>Address: {wave.address}</div> 
          <div>Time: {wave.timestamp.toString()}</div> 
          <div>Message: {wave.message}</div>
      </div>
    )
  })
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Steve<br/>Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/* This button will render if there's no wallet connection */} 
        { 
          !currentAccount && ( 
            !loading && (
              <button className="waveButton" onClick={connectWallet}>
                 connect wallet
              </button>
          )      
          )
        }
        {
          loading && (
            <ReactLoading className="loader" type="spin" color="black" height={20} width={70} /> 
          )
        }
        {
          sucessfull && (
            <div>
              Wallet connected sucessfully
            </div>
          )
        }
      </div>
    </div>
  );
}
