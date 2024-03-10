// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

interface IAcuracleFeed {
    /**
     * @dev Get the oracle latest round data,
     * consumers can ensure no stale data by inspecting the updatedAt param
     */
    function getRoundData()
        external
        view
        returns (
            int256 answer,
            uint64 roundId,
            uint64 startedAt,
            uint64 updatedAt
        );

    /**
     * @dev Get the oracle data for a particular round,
     * consumers can ensure no stale data by inspecting the updatedAt param
     *
     * @param roundId the specific round identifier
     */
    function getRoundData(
        uint64 _roundId
    )
        external
        view
        returns (
            int256 answer,
            uint64 roundId,
            uint64 startedAt,
            uint64 updatedAt
        );

    /**
     * @dev Get the oracle latest round data with meta data for frontend use,
     * consumers can ensure no stale data by inspecting the updatedAt param
     */
    function getRoundDataWithMeta()
        external
        view
        returns (
            int256 answer,
            uint64 processors,
            string memory description,
            uint8 decimal,
            uint64 updatedAt
        );
}
