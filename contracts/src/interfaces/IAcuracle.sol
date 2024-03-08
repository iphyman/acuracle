// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

interface IAcuracle {
    /**
     * @notice Revert if oracle is already enabled
     */
    error OracleEnabled();

    /**
     * @notice Revert when trying to remove oracle/processor that is not enabled
     */
    error OracleDoesNotExist();

    /**
     * @notice Revert if the oracle is trying to submit twice in a single round
     */
    error AlreadySubmitted();

    /**
     * @notice Revert if caller is not an allowed processor/oracle
     */
    error OnlyOracle();

    /**
     * @notice Revert if round Id is invalid
     */
    error InvalidRoundId();

    /**
     * @notice Emitted whenever a new processor/oracle is enabled
     */
    event AddProcessor(address indexed processor);

    /**
     * @notice Emitted whenever a new processor/oracle is disabled
     */
    event RemoveProcessor(address indexed processor);

    /**
     * @notice Emitted when an oracle submits an answer
     */
    event Submit(address indexed processor, int256 price);

    /**
     * @dev Called by the acurast processors to submit oracle response
     * @param price the off-chain price from exchange or data sources
     */
    function submit(int256 price) external;

    /**
     * @dev Allow oracle feed owner to whitelist accurast processor
     * @param processor the acurast job processor address
     */
    function addProcessor(address processor) external;

    /**
     * @dev Allow oracle feed owner to whitelist accurast processors
     * @param processors the acurast job processor address
     */
    function addProcessors(address[] memory processors) external;

    /**
     * @dev Allow oracle feed owner to remove a processor
     * @param processor address of accurast processor
     */
    function removeProcessor(address processor) external;

    /**
     * @dev Allow oracle feed owner to remove a processors
     * @param processors address of accurast processor
     */
    function removeProcessors(address[] memory processors) external;

    /**
     * @dev Check if an address is whitelisted process for feed
     * @param processor address to check
     * @return bool true if valid otherwise false
     */
    function isValidProcessor(address processor) external view returns (bool);

    /**
     * @dev Get the list of enabled acurast processors
     * @return oracles an array of addresses
     */
    function getOracles() external view returns (address[] memory oracles);

    /**
     * @dev Get the total enabled acurast processors
     * @return oracleCount total oracles
     */
    function getOracleCount() external view returns (uint16 oracleCount);
}
