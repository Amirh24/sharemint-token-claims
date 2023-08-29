require("dotenv").config();
import hre from "hardhat";

async function main() {
  if (!process.env.TOKEN_CLAIMS_ADDRESS)
    throw new Error("No token claims address set in .env");

  if (!process.env.MERKLE_ROOT) throw new Error("No merkle root provided");

  const contract = await hre.ethers.getContractAt(
    "TokenClaims",
    process.env.TOKEN_CLAIMS_ADDRESS
  );

  console.log("Setting root:", process.env.MERKLE_ROOT);

  const tx = await contract.setMerkleRoot(process.env.MERKLE_ROOT);

  console.log(`Setting root set in tx: https://sepolia.etherscan.io/tx/${tx.hash}`);

  await tx.wait();

  console.log("Merkle root set");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
