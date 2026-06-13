// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TipJar {
    address public owner;

    event NewTip(address indexed from, uint256 amount, string message);

    error NotOwner();
    error NoValue();
    error TransferFailed();
    error NoBalance();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function tip(string calldata message) external payable {
        if (msg.value == 0) revert NoValue();
        emit NewTip(msg.sender, msg.value, message);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoBalance();
        (bool ok, ) = payable(owner).call{value: balance}("");
        if (!ok) revert TransferFailed();
    }
}
