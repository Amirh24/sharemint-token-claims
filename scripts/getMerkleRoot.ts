require("dotenv").config();
import hre from "hardhat";

async function main() {
  if (!process.env.TOKEN_CLAIMS_ADDRESS)
    throw new Error("No token claims address set in .env");

  const contract = await hre.ethers.getContractAt(
    "TokenClaims",
    process.env.TOKEN_CLAIMS_ADDRESS
  );

  const res = await contract.merkleRoot();

  console.log(`Merkle root: ${res}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
