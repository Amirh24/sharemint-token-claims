// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenClaims is Ownable {
    IERC20 public token;
    bool public isETH = false;
    bytes32 public merkleRoot;
    mapping(address => uint256) public claimedAmount;

    event Claimed(address account, uint256 amount);

    constructor(address token_, bytes32 merkleRoot_) {
        if(token_ == address(0)) {
            isETH = true;
        } else {
            token = IERC20(token_);
        }
        merkleRoot = merkleRoot_;
    }

    function setMerkleRoot(bytes32 merkleRoot_) external onlyOwner {
        merkleRoot = merkleRoot_;
    }

    function claim(address account, uint256 totalAmount, bytes32[] calldata merkleProof) external {
        bytes32 node = keccak256(abi.encodePacked(account, totalAmount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid merkle proof");

        uint256 amountToClaim = totalAmount - claimedAmount[account];
        require(amountToClaim > 0, "No tokens left to claim");
        claimedAmount[account] = totalAmount;

        if (isETH) {
            payable(account).transfer(amountToClaim);
        } else {
            require(token.transfer(account, amountToClaim), "Transfer failed");
        }

        emit Claimed(account, amountToClaim);
    }

    // Allow the contract to receive ETH
    receive() external payable {}

    // Function to allow owner to withdraw accidentally sent ETH
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Function to allow owner to withdraw accidentally sent ERC20 tokens
    function withdrawToken(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20 _token = IERC20(tokenAddress);
        uint256 balance = _token.balanceOf(address(this));
        require(balance >= amount, "Not enough tokens in the contract");
        require(_token.transfer(owner(), amount), "Token transfer failed");
    }
}