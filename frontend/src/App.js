import { ethers } from "ethers";
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
  const [mining, setMining] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [metamaskInstall, setMetamaskInstall] = useState(false); 
  const [prevMessages, setPrevMessages] = useState(false); 
  const [noMessages, setNoMessages] = useState(false); 

  const contractAddress = "0x3412b425Cd05968DF71119C2B02deDe6e6CEDDA2"; 
  const contractABI = abi; 

  const wave = async (e) => { 
    e.preventDefault(); 

    try {
      const { ethereum } = window; 

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); 
        const signer = provider.getSigner(); 

        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer); 

        let count = await wavePortalContract.getTotalWaves(); 
        console.log("Retrieved total wave count: ", count.toNumber()); 

        // Executing actual wave from the smart contract
        setLoading(true); 
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 }); 
        setLoading(false); 
        setMining(true); 
        console.log("Mining...", waveTxn.hash); 
        
        await waveTxn.wait(); 
        console.log("Mined ---", waveTxn.hash); 
        setMining(false); 

        // Retrieve the total waves
        setLoading(true); 
        count = await wavePortalContract.getTotalWaves(); 
        setLoading(false); 
        console.log("Total waves are equal to: ", count); 

        console.log("Ethereum object exists"); 
        console.log("Retrieved a total of: ", count.toNumber(), " waves"); 
        setMessage(""); 

      } else {
        console.log("Ethereum object does not exist"); 
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletisConnected = async () => { 
    try {
      const { ethereum } = window; 

      if (!ethereum) { 
        setMetamaskInstall(true); 
        console.log("Make sure you have metamask installed")
      } else {
        console.log("Ethereum from window object is found!"); 
      }

      // See if we have authorization to the users wallet 
      const accounts = await ethereum.request({method: "eth_accounts"}); 
      if (accounts.length !== 0){
        const account = accounts[0]; 

        console.log("Found an authorized account: ", account); 
        setCurrentAccount(account); 
        getAllWaves(); 

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
    
    setSucessfull(true); 

    setTimeout( () => {
      setSucessfull(false); 
    }, 3000); 

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
        setLoading(true); 
        const waves = await WavePortalContract.getAllWaves(); 
        setLoading(false); 

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
        console.log(wavesCleaned); 
      } else {
        console.log("Ethereum objec does not exist")
      }
    } catch (error) {
        console.log(error)
    }
  }

  // Listen for emitter events 
  useEffect( () => {
    let wavePortalContract; 

    const onNewWave = (from, timestamp, message) => {
      console.log("New wave: ", from, timestamp, message); 
      setAllWaves( prevState => [
           ...prevState, 
           {
             address: from, 
             timestamp: new Date(timestamp * 1000), 
             message: message
           }, 
          ]); 
    }; 

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum); 
      const signer = provider.getSigner(); 

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer); 
      wavePortalContract.on("NewWave", onNewWave)
    }

    return () => {
      if(wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave)
      }
    }
  })

  // Handling input 
  const handleChange = (event) => {
    const {value} = event.target; 
    setMessage(value); 
  }

  // Showing previous messages 
  const showPreviousMessages = () => {
     if (allWaves.length === 0) {
       setNoMessages(true); 
       setTimeout( () => {
         setNoMessages(false); 
       }, 5000); 
       console.log("Opps no messages sent yet!")
     } else {
      setPrevMessages( current => !current)
     }
  }
   

  const wavesDisplay = allWaves.map( (wave, index) => {
    return (
      <div key={index} className="prevMessages-div">
          <p>Address: {wave.address} <br/> Time: {wave.timestamp.toString()} <br/> Message: {wave.message} </p> 
          {/* <div>Time: {wave.timestamp.toString()}</div> 
          <div>Message: {wave.message}</div> */}
      </div>
    )
  })
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        {
          !currentAccount && (
            <div className="intro">
                  <h1>Get some Ether!</h1>
                  <p>Kindly follow the prompts</p>
            </div>
          )
        }
        {/* This button will render if there's no wallet connection */} 
        { 
          !currentAccount ? ( 
            !loading && (
              <>  
                <div className="connect-wallet">
                   <p>Connect your wallet to continue using the web app</p>
                </div>
                <button className="waveButton" onClick={connectWallet}>
                  connect wallet
                </button>
              </>  
          )      
          ) : (
            <>
                <div className="header">
                  Hey there!
                </div>

                <div className="bio">
                  I am Steve <br/>Send me a intriuging message and stand a chance to win some ether 🤓! 
                </div>
                
                <form className="form-input"> 
                  <input type="text" className="message" value={message} name="message" onChange={handleChange} /> 
                  <button type="submit" className="waveButton-wave" onClick={wave}>
                      Send message
                  </button>
                </form>

                <button className="checkprev-button" onClick={ () => showPreviousMessages() }>
                  { prevMessages ? "Hide" : "Check" } previous messages 
                </button>
            </>
          )
        }
        {
          loading && (
            <>
              <ReactLoading className="loader" type="spin" color="black" height={20} width={70} /> 
            </>
          )
        }
        {
          mining && (
           <div className="mining-div">
              <p>Mining</p>
              <ReactLoading className="loader" type="bubbles" color="black" height={10} width={70} /> 
           </div>
          )
        }
        {
          sucessfull && (
            <div className="successfull">
              Wallet connected sucessfully!
            </div>
          )
        }
        {
          metamaskInstall && (
            <div className="metamask-install">
              <p>Warning! Kindly install metamask in order to continue using the application <br/> Check it out over <a href="https://metamask.io/" target="_blank">here</a></p>
            </div>
          )
        }
        {
          noMessages && (
            <div className="no-messages">
               <p>Opps😶! No messages here yet</p>
            </div>
          )
        }
        
        <div>
          {
            prevMessages && (
              <>
                { wavesDisplay }
                {/* <div className="prevMessages-div">
                      
                </div> */}
              </>
            )
          }
        </div>

      </div>
    </div>
  );
}
