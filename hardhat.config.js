require("@nomicfoundation/hardhat-toolbox");

// A hardhat task that is manually created
task("accounts","Prints the list of accounts", async (taskArgs,hre) => {
  const accounts = await hre.ethers.getSigners(); 

  for(const account of accounts){
    console.log(account.address); 
  }
}); 

// This part is for exporting an object in order to set up the config file
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
};
