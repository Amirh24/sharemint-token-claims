const { expect } = require("chai");
const { ethers } = require("hardhat");
const { defaultAbiCoder } = ethers.utils;

describe("TokenClaims", function () {
    let Token, token, TokenClaims, tokenClaims, owner, addr1, addr2;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("TestToken");
        token = await Token.deploy();
        await token.waitForDeployment();

        TokenClaims = await ethers.getContractFactory("TokenClaims");
        tokenClaims = await TokenClaims.deploy(token.address, defaultAbiCoder.encode(["bytes32"], [ethers.utils.keccak256("0x1234")]));
        await tokenClaims.waitForDeployment();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe("Deployment", function() {
        it("Should set the right owner", async function() {
            expect(await tokenClaims.owner()).to.equal(owner.address);
        });

        it("Should set the correct merkle root", async function() {
            const merkleRoot = defaultAbiCoder.encode(["bytes32"], [ethers.utils.keccak256("0x1234")]);
            expect(await tokenClaims.merkleRoot()).to.equal(merkleRoot);
        });
    });

    describe("setMerkleRoot", function() {
        it("Should allow the owner to set the merkle root", async function() {
            const newMerkleRoot = defaultAbiCoder.encode(["bytes32"], [ethers.utils.keccak256("0x5678")]);
            await tokenClaims.setMerkleRoot(newMerkleRoot);
            expect(await tokenClaims.merkleRoot()).to.equal(newMerkleRoot);
        });

        it("Should not allow non-owner to set the merkle root", async function() {
            const newMerkleRoot = defaultAbiCoder.encode(["bytes32"], [ethers.utils.keccak256("0x5678")]);
            await expect(tokenClaims.connect(addr1).setMerkleRoot(newMerkleRoot)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    // This is a very basic claim test. More detailed tests would need valid Merkle proofs and other related data.
    describe("claim", function() {
        it("Should revert with an invalid merkle proof", async function() {
            await expect(tokenClaims.claim(addr1.address, ethers.utils.parseEther("10"), [])).to.be.revertedWith("Invalid merkle proof");
        });

        // TODO: Add more claim tests here...
    });
});