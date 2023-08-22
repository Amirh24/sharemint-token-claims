const hre = require("hardhat");

async function main() {
  // Define the token address and merkleRoot that you want to use
  const tokenAddress = "0xYourTokenAddressHere";
  const merkleRoot = "0xYourMerkleRootHere";

  // Retrieve the contract factory
  const TokenClaims = await hre.ethers.getContractFactory("TokenClaims");

  // Deploy the TokenClaims contract with the given token address and merkleRoot
  const tokenClaims = await TokenClaims.deploy(tokenAddress, merkleRoot);

  // Wait for the transaction to be mined
  // await tokenClaims.deployed();
  await tokenClaims.waitForDeployment(); // Wait for the transaction to be mined


  console.log("TokenClaims deployed to:", tokenClaims.address);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });