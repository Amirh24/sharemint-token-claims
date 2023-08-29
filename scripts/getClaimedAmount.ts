require("dotenv").config();
import hre from "hardhat";

async function main() {
  if (!process.env.TOKEN_CLAIMS_ADDRESS)
    throw new Error("No token claims address set in .env");

  if (!process.env.ADDRESS)
    throw new Error("No address set");

  const contract = await hre.ethers.getContractAt(
    "TokenClaims",
    process.env.TOKEN_CLAIMS_ADDRESS
  );

  const res = await contract.claimedAmount(process.env.ADDRESS);

  console.log(`Claimed amount: ${res}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
