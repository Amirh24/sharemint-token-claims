import { keccak256 } from "ethers";
import hre from "hardhat";

async function main() {
  let tokenAddress = process.env.TOKEN_ADDRESS;

  if (tokenAddress === 'CREATE_TOKEN') {
    const TestToken = await hre.ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy();
    await testToken.waitForDeployment();

    tokenAddress = await testToken.getAddress();
  }

  if (!tokenAddress) throw new Error("No token address found");

  const merkleRoot = keccak256("0x1234");
  
  console.log("tokenAddress:", tokenAddress);
  console.log("merkleRoot:", merkleRoot)

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
