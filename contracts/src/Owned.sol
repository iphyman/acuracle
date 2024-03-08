// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

contract Owned {
    /**
     * @notice Emitted whenever the contract ownership changes
     */
    event OwnerChanged(address indexed prevOwner, address indexed newOwner);

    /**
     * @notice Revert if caller is not owner
     */
    error OnlyOwner();

    /**
     * @notice keep track of contract owner
     */
    address public owner;

    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }

    constructor(address _owner) {
        _setOwner(address(0), _owner);
    }

    /**
     * @dev Allow configuring new contract owner
     * @param newOwner address of new owner
     */
    function setOwner(address newOwner) external onlyOwner {
        _setOwner(owner, newOwner);
    }

    function _setOwner(address prevOwner, address newOwner) private {
        emit OwnerChanged(prevOwner, newOwner);
        owner = newOwner;
    }
}
