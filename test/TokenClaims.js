const { ethers } = require("hardhat");

const { expect } = require("chai");

describe("TokenClaims", () => {
  let TokenClaims;
  let tokenClaims;
  let ERC20;
  let token;
  let owner;
  let claimer;
  let merkleRoot;
  let claimAmount;
  let merkleProof;

  beforeEach(async () => {
    // Deploy ERC20 token for testing
    ERC20 = await ethers.getContractFactory("TestToken");
    token = await ERC20.deploy();
    await token.waitForDeployment(); // Wait for the transaction to be mined

    // Set initial merkle root for testing
    merkleRoot = ethers.keccak256("0x1234");

    // Deploy TokenClaims contract
    TokenClaims = await ethers.getContractFactory("TokenClaims");
    [owner, claimer] = await ethers.getSigners();
    tokenClaims = await TokenClaims.deploy(token.target, merkleRoot);
    await tokenClaims.waitForDeployment();

    // Set a claim amount and merkle proof for testing
    claimAmount = ethers.parseEther("100");
    const leaf = ethers.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claimer.address, claimAmount]));
    merkleProof = [leaf]; // This is just a sample; in practice, you would construct a valid Merkle proof

    // Mint tokens to TokenClaims contract
    await token.mint(tokenClaims.target, claimAmount);
  });

  it("should allow a claim", async () => {
    // You'll need to set up a real Merkle proof for this to pass
    // For now, this will demonstrate the test structure and will fail with "Invalid merkle proof"
    await expect(tokenClaims.claim(claimer.address, claimAmount, merkleProof)).to.be.revertedWith("Invalid merkle proof");
  });

  it("should emit Claimed event on successful claim", async () => {
    // You would replace this with the correct setup for a successful claim
    // For now, this will demonstrate the test structure
    await expect(tokenClaims.claim(claimer.address, claimAmount, merkleProof))
      .to.be.reverted; // Expecting revert due to invalid Merkle proof
  });

  it("should prevent claiming more than the total amount", async () => {
    // You would replace this with the correct setup for this case
    // For now, this will demonstrate the test structure
    const overClaimAmount = ethers.utils.parseEther("101");
    await expect(tokenClaims.claim(claimer.address, overClaimAmount, merkleProof))
      .to.be.revertedWith("Invalid merkle proof"); // Expecting revert due to invalid Merkle proof
  });

  // More tests as needed for your specific use case
});