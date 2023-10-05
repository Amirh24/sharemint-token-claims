import { keccak256 } from "ethers";
import hre from "hardhat";

async function main() {
  // const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let tokenAddress = process.env.TOKEN_ADDRESS;

  // comment out if you don't want to deploy the test token
  if (!tokenAddress) {
    const TestToken = await hre.ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy();
    await testToken.waitForDeployment();

    tokenAddress = await testToken.getAddress();
  }

  if (!tokenAddress) throw new Error("No token address found");

  const merkleRoot = keccak256("0x1234");

  console.log("tokenAddress:", tokenAddress);

  const TokenClaims = await hre.ethers.getContractFactory("TokenClaims");
  const tokenClaims = await TokenClaims.deploy(tokenAddress, merkleRoot);
  await tokenClaims.waitForDeployment();

  console.log("TokenClaims deployed to:", await tokenClaims.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
