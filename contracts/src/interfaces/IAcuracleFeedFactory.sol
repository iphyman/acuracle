// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

interface IAcuracleFeedFactory {
    /**
     * @notice Emitted whenever a new feed is deployed
     */
    event CreateFeed(address indexed feed, address indexed creator);

    /**
     * @dev Allow anyone to easily deploy a new price feed
     *
     * @param name the oracle tick symbol or name
     */
    function createFeed(string memory name) external;

    /**
     * @dev Fetch all price feeds deployed by an account
     * @param account the account to filter for
     */
    function getFeeds(address account) external view returns (address[] memory);
}
