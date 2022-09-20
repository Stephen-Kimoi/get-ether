const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners(); 
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); 
    const waveContract = await await waveContractFactory.deploy(); 
    await waveContract.deployed(); 

    console.log("Contract deployed to: ", waveContract.address);  
    console.log("Contract deployed by: ", owner.address);

    let waveCount; 
    waveCount = await waveContract.getTotalWaves(); 

    let waveTxn = await waveContract.wave(); 
    await waveTxn.wait(); 

    waveCount = await waveContract.getTotalWaves(); 

    waveTxn = await waveContract.connect(randomPerson).wave(); 
    await waveTxn.wait(); 

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