// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenClaims {
    IERC20 public token;
    bytes32 public merkleRoot;
    mapping(address => uint256) public claimedAmount;

    event Claimed(address account, uint256 amount);

    constructor(address token_, bytes32 merkleRoot_) {
        token = IERC20(token_);
        merkleRoot = merkleRoot_;
    }

    function setMerkleRoot(bytes32 merkleRoot_) external {
        merkleRoot = merkleRoot_;
    }

    function claim(address account, uint256 totalAmount, bytes32[] calldata merkleProof) external {
        // Verify the merkle proof
        bytes32 node = keccak256(abi.encodePacked(account, totalAmount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid merkle proof");

        // Calculate the claimable amount
        uint256 amountToClaim = totalAmount - claimedAmount[account];
        require(amountToClaim > 0, "No tokens left to claim");

        // Update the claimed amount
        claimedAmount[account] = totalAmount;

        // Send the token
        require(token.transfer(account, amountToClaim), "Transfer failed");

        emit Claimed(account, amountToClaim);
    }
}