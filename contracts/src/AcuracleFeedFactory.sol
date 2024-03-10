// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {IAcuracleFeedFactory} from "./interfaces/IAcuracleFeedFactory.sol";
import {Owned} from "./Owned.sol";
import {Acuracle} from "./Acuracle.sol";

contract AcuracleFeedFactory is IAcuracleFeedFactory, Owned {
    struct AccountFeed {
        uint256 nonce;
        address[] feeds;
    }

    /**
     * @dev keep track of account feed and nonce
     */
    mapping(address => AccountFeed) private _accountFeeds;

    constructor() Owned(msg.sender) {}

    /// @inheritdoc IAcuracleFeedFactory
    function createFeed(string memory name) external override {
        uint256 nonce = _accountFeeds[msg.sender].nonce;
        address feed = address(
            new Acuracle{salt: keccak256(abi.encode(msg.sender, nonce))}(
                msg.sender,
                name
            )
        );

        _accountFeeds[msg.sender].nonce += 1;
        _accountFeeds[msg.sender].feeds.push(feed);

        emit CreateFeed(feed, msg.sender);
    }

    /// @inheritdoc IAcuracleFeedFactory
    function getFeeds(
        address account
    ) external view override returns (address[] memory) {
        return _accountFeeds[account].feeds;
    }
}
