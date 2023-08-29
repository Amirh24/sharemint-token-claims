require("dotenv").config();
import hre from "hardhat";

async function main() {
  if (!process.env.TOKEN_CLAIMS_ADDRESS)
    throw new Error("No token claims address set in .env");

  if (!process.env.TOKEN_TEST_ADDRESS)
    throw new Error("No test token set in .env");

  if (!process.env.AMOUNT) throw new Error("No amount set in .env");

  const contract = await hre.ethers.getContractAt(
    "TestToken",
    process.env.TOKEN_TEST_ADDRESS
  );

  console.log(
    `Sending ${process.env.AMOUNT} tokens to ${process.env.TOKEN_CLAIMS_ADDRESS}`
  );

  const amount = hre.ethers.parseEther(process.env.AMOUNT);

  const tx = await contract.transfer(process.env.TOKEN_CLAIMS_ADDRESS, amount);

  console.log(`Sending tokens in tx: https://sepolia.etherscan.io/tx/${tx.hash}`);

  await tx.wait();

  console.log("Tokens sent");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
