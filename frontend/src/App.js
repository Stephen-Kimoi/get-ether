import * as React from "react";
// import { ethers } from "ethers";
import { useEffect, useState } from "react";
import ReactLoading from 'react-loading'
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false); 

  const wave = () => {
    console.log(233344)
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
    setLoading(!loading)
    try {
      const { ethereum } = window; 

      if(!ethereum){
        alert("Get Metamask!"); 
        return; 
      } 

      const accounts = await ethereum.request({method: "eth_requestAccounts"}); 

      console.log("Connected: ", accounts[0]); 
      setCurrentAccount(accounts[0]); 
    } catch(error) {
      console.log(error)
    }
    setLoading(!loading)
  }

  useEffect( () => {
    checkIfWalletisConnected(); 
  }, [])
  
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
      </div>
    </div>
  );
}
