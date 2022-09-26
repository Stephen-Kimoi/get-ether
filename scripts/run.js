const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners(); 
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); 
    const waveContract = await await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"), 
    }); 
    await waveContract.deployed(); 

    console.log("Contract deployed to: ", waveContract.address);  
    console.log("Contract deployed by: ", owner.address);

    // Getting the contract balance
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address); 
    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance)); 

    let waveCount; 
    waveCount = await waveContract.getTotalWaves(); 
    console.log(waveCount.toNumber()); 

    // Sending a wave
    let waveTxn = await waveContract.wave("This is the first message"); 
    await waveTxn.wait(); // Waits for the transaction to be mined

    console.log("Contract balance: ", hre.ethers.utils.formatEther(contractBalance)); 

    waveTxn = await waveContract.connect(randomPerson).wave("A random person just waved"); 
    await waveTxn.wait(); 

    let allWaves = await waveContract.getAllWaves(); 
    console.log(allWaves); 

    waveCount = await waveContract.getTotalWaves(); 
}

const runMain = async () => {
    try {
        await main(); 
        process.exit(0); // Exit a node process without an error
    } catch (error) {
        console.log(error); 
        process.exit(1); // Exits a node process with an error
    }
}

runMain(); 