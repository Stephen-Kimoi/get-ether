const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); 
    const waveContract = await await waveContractFactory.deploy(); 
    await waveContract.deployed(); 
    console.log("Contract deployed to: ", waveContract.address);  
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