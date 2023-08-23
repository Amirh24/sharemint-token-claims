const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = ethers.utils;

describe("TokenClaims", function () {
    let owner, addr1, addr2, token, tokenClaims, merkleRoot, merkleProof;
    
    beforeEach(async function () {
        // Deploying Mock ERC20 for tests
        const MockERC20 = await ethers.getContractFactory("TestToken");
        token = await MockERC20.deploy();
        await token.waitForDeployment();

        // Setting up a basic merkle root and proof (this is a mock for simplicity, real Merkle trees would require more complex setup)
        merkleRoot = keccak256("0x1234");

        // Deploy TokenClaims contract with ERC20
        const TokenClaims = await ethers.getContractFactory("TokenClaims");
        tokenClaims = await TokenClaims.deploy(token.address, merkleRoot);
        await tokenClaims.waitForDeployment();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe("Claiming Process", function () {
        it("Should allow a claim with ERC20", async function () {
            // Mock the claim process (without real merkle proof)
            await token.transfer(tokenClaims.address, ethers.utils.parseEther("100"));
            await tokenClaims.claim(addr1.address, ethers.utils.parseEther("50"), []);

            expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("50"));
        });

        it("Should allow a claim with ETH", async function () {
            // Deploy TokenClaims contract with ETH option
            const TokenClaimsETH = await ethers.getContractFactory("TokenClaims");
            const tokenClaimsETH = await TokenClaimsETH.deploy(ethers.constants.AddressZero, merkleRoot);
            await tokenClaimsETH.waitForDeployment();

            await owner.sendTransaction({ to: tokenClaimsETH.address, value: ethers.utils.parseEther("1") });
            await tokenClaimsETH.claim(addr1.address, ethers.utils.parseEther("0.5"), []);

            expect(await addr1.getBalance()).to.be.above(ethers.utils.parseEther("99.5")); // taking into account some gas costs
        });
    });

    describe("Owner functions", function () {
        it("Owner should be able to set new Merkle root", async function () {
            const newRoot = keccak256("0x5678");
            await tokenClaims.setMerkleRoot(newRoot);
            expect(await tokenClaims.merkleRoot()).to.equal(newRoot);
        });

        it("Owner should be able to withdraw accidentally sent ERC20", async function () {
            await token.transfer(tokenClaims.address, ethers.utils.parseEther("100"));
            await tokenClaims.withdrawToken(token.address, ethers.utils.parseEther("100"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10000"));
        });

        it("Owner should be able to withdraw accidentally sent ETH", async function () {
            await owner.sendTransaction({ to: tokenClaims.address, value: ethers.utils.parseEther("1") });
            await tokenClaims.withdrawETH();
            expect(await owner.getBalance()).to.be.above(ethers.utils.parseEther("99")); // taking into account some gas costs
        });
    });

    describe("Unauthorized functions", function () {
        it("Non-owner should not be able to set Merkle root", async function () {
            const newRoot = keccak256("0x5678");
            await expect(tokenClaims.connect(addr1).setMerkleRoot(newRoot)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});