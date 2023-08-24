import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";
// import MerkleTree from "merkletreejs";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

describe("TokenClaims", function () {
  let owner: Signer,
    addr1: Signer,
    addr2: Signer,
    token: Contract,
    tokenClaims: Contract;

  beforeEach(async function () {
    // Deploying Mock ERC20 for tests
    const MockERC20 = await ethers.getContractFactory("TestToken");
    token = await MockERC20.deploy();
    await token.waitForDeployment();

    const merkleRoot = ethers.keccak256("0x1234");

    // Deploy TokenClaims contract with ERC20
    const TokenClaims = await ethers.getContractFactory("TokenClaims");
    tokenClaims = await TokenClaims.deploy(token.getAddress(), merkleRoot);
    await tokenClaims.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Claiming Process", function () {
    it("Should allow a claim with ERC20", async function () {
      const addr1Amount = 100;

      const addressesWithAmounts = [
        [await addr1.getAddress(), ethers.parseEther(String(addr1Amount))],
        [await owner.getAddress(), 0],
      ];

      const tree = StandardMerkleTree.of(addressesWithAmounts, [
        "address",
        "uint256",
      ]);

      const root = tree.root;
      const proof = tree.getProof(0);

      console.log({ root, proof });

      await tokenClaims.setMerkleRoot(root);

      await token.transfer(
        tokenClaims.getAddress(),
        ethers.parseEther(String(addr1Amount))
      );

      const verified = StandardMerkleTree.verify(
        root,
        ["address", "uint"],
        [await addr1.getAddress(), ethers.parseEther(String(addr1Amount))],
        proof
      );
      expect(verified).to.be.true;

      await tokenClaims.claim(
        addr1.getAddress(),
        ethers.parseEther(String(addr1Amount)),
        proof
      );

      expect(await token.balanceOf(addr1.getAddress())).to.equal(
        ethers.parseEther(String(addr1Amount))
      );
    });

    it("Should allow a claim with ETH", async function () {
      // Deploy TokenClaims contract with ETH option
      const TokenClaimsETH = await ethers.getContractFactory("TokenClaims");
      const tokenClaimsETH = await TokenClaimsETH.deploy(
        ethers.ZeroAddress,
        ethers.keccak256("0x1234")
      );
      await tokenClaimsETH.waitForDeployment();

      const addr1Amount = 1;

      const addressesWithAmounts = [
        [await addr1.getAddress(), ethers.parseEther(String(addr1Amount))],
        [await owner.getAddress(), 0],
      ];

      const tree = StandardMerkleTree.of(addressesWithAmounts, [
        "address",
        "uint256",
      ]);

      const root = tree.root;
      const proof = tree.getProof(0);

      await tokenClaimsETH.setMerkleRoot(root);

      await owner.sendTransaction({
        to: tokenClaimsETH.getAddress(),
        value: ethers.parseEther(String(addr1Amount)),
      });
      await tokenClaimsETH.claim(
        addr1.getAddress(),
        ethers.parseEther(String(addr1Amount)),
        proof
      );

      expect(await ethers.provider.getBalance(addr1.getAddress())).to.be.above(
        ethers.parseEther("99.5")
      ); // taking into account some gas costs
    });
  });

  describe("Owner functions", function () {
    it("Owner should be able to set new Merkle root", async function () {
      const newRoot = ethers.keccak256("0x5678");
      await tokenClaims.setMerkleRoot(newRoot);
      expect(await tokenClaims.merkleRoot()).to.equal(newRoot);
    });

    it("Owner should be able to withdraw accidentally sent ERC20", async function () {
      expect(await token.balanceOf(owner.getAddress())).to.equal(
        ethers.parseEther("1000000")
      );
      await token.transfer(tokenClaims.getAddress(), ethers.parseEther("100"));
      expect(await token.balanceOf(owner.getAddress())).to.equal(
        ethers.parseEther(String(1000000 - 100))
      );
      await tokenClaims.withdrawToken(
        token.getAddress(),
        ethers.parseEther("100")
      );
      expect(await token.balanceOf(owner.getAddress())).to.equal(
        ethers.parseEther("1000000")
      );
    });

    it("Owner should be able to withdraw accidentally sent ETH", async function () {
      await owner.sendTransaction({
        to: tokenClaims.getAddress(),
        value: ethers.parseEther("1"),
      });
      await tokenClaims.withdrawETH();
      expect(await ethers.provider.getBalance(owner.getAddress())).to.be.above(
        ethers.parseEther("99")
      ); // taking into account some gas costs
    });
  });

  describe("Unauthorized functions", function () {
    it("Non-owner should not be able to set Merkle root", async function () {
      const newRoot = ethers.keccak256("0x5678");
      // TODO fix any
      await expect(
        (tokenClaims.connect(addr1) as any).setMerkleRoot(newRoot)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
