// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {IAcuracle} from "./interfaces/IAcuracle.sol";
import {IAcuracleFeed} from "./interfaces/IAcuracleFeed.sol";
import {Owned} from "./Owned.sol";

contract Acuracle is Owned, IAcuracle, IAcuracleFeed {
    struct RoundSubmission {
        int256 numerator;
        uint64 startedAt;
        uint64 updatedAt;
        int64 denominator;
        uint64 timeout;
        mapping(address oracle => bool updated) status;
    }

    struct Oracle {
        bool isEnabled;
        uint64 index;
    }

    /**
     * @dev store the latest round id
     */
    uint64 public latestRoundId;

    /**
     * @dev store the oracle decimal precision
     */
    uint8 public decimals;

    /**
     * @dev store the feed symbol name
     */
    string public name;

    /**
     * @dev How long to wait for oracles before timeout on rounds
     */
    uint256 internal constant ROUND_EXPIRY = 5 minutes;

    /**
     * @dev keep track of oracle address (Acurast processors address)
     */
    mapping(address processor => Oracle) private _oracles;

    /**
     * @dev An array of all enabled acurast processors
     */
    address[] private _oracleAddresses;

    /**
     * @dev keep track of oracle round submissions
     */
    mapping(uint64 roundId => RoundSubmission) private _submissions;

    constructor(
        address _owner,
        uint8 _decimals,
        string memory _name
    ) Owned(_owner) {
        decimals = _decimals;
        name = _name;
    }

    /// @inheritdoc IAcuracle
    function submit(int256 price) external override {
        if (!_oracles[msg.sender].isEnabled) revert OnlyOracle();

        uint64 _roundId = latestRoundId;
        RoundSubmission storage submission = _submissions[_roundId];

        if (submission.timeout > block.timestamp) {
            _submit(_roundId, price, false);
        } else {
            unchecked {
                _roundId += 1;
                latestRoundId += 1;
            }

            _submit(_roundId, price, false);
        }
    }

    /// @inheritdoc IAcuracle
    function addProcessor(address processor) external override onlyOwner {
        _addProcessor(processor);
    }

    /// @inheritdoc IAcuracle
    function addProcessors(
        address[] memory processors
    ) external override onlyOwner {
        // cache the length to save gas on each iteration
        uint256 _addLength = processors.length;

        for (uint256 i = 0; i < _addLength; i++) {
            _addProcessor(processors[i]);
        }
    }

    /// @inheritdoc IAcuracle
    function removeProcessor(address processor) external override onlyOwner {
        _removeProcessor(processor);
    }

    /// @inheritdoc IAcuracle
    function removeProcessors(
        address[] memory processors
    ) external override onlyOwner {
        // cache the length to save gas on each iteration
        uint256 _removeLength = processors.length;

        for (uint256 i = 0; i < _removeLength; i++) {
            _removeProcessor(processors[i]);
        }
    }

    /// @inheritdoc IAcuracle
    function isValidProcessor(
        address processor
    ) external view override returns (bool) {
        return _oracles[processor].isEnabled;
    }

    /// @inheritdoc IAcuracle
    function getOracles() external view override returns (address[] memory) {
        return _oracleAddresses;
    }

    /// @inheritdoc IAcuracle
    function getOracleCount()
        external
        view
        override
        returns (uint16 oracleCount)
    {
        oracleCount = uint16(_oracleAddresses.length);
    }

    /// @inheritdoc IAcuracleFeed
    function getRoundData()
        external
        view
        override
        returns (
            int256 answer,
            uint64 roundId,
            uint64 startedAt,
            uint64 updatedAt
        )
    {
        (answer, roundId, startedAt, updatedAt) = _getRoundData(latestRoundId);
    }

    /// @inheritdoc IAcuracleFeed
    function getRoundData(
        uint64 _roundId
    )
        external
        view
        override
        returns (
            int256 answer,
            uint64 roundId,
            uint64 startedAt,
            uint64 updatedAt
        )
    {
        (answer, roundId, startedAt, updatedAt) = _getRoundData(_roundId);
    }

    /**
     * @dev Internal function to add a new processor
     * @param _processor the processor address
     */
    function _addProcessor(address _processor) private {
        if (_oracles[_processor].isEnabled) revert OracleEnabled();

        uint64 index = uint64(_oracleAddresses.length);

        _oracleAddresses.push(_processor);
        _oracles[_processor] = Oracle({isEnabled: true, index: index});

        emit AddProcessor(_processor);
    }

    /**
     * @dev Internal function to remove a processor no longer needed
     * @param _processor the processor address to remove
     */
    function _removeProcessor(address _processor) private {
        if (!_oracles[_processor].isEnabled) revert OracleDoesNotExist();

        uint64 lastIndex = uint64(_oracleAddresses.length - 1);
        address lastOracle = _oracleAddresses[lastIndex];
        uint64 indexToReplace = _oracles[_processor].index;

        _oracleAddresses[indexToReplace] = lastOracle;
        _oracles[lastOracle].index = indexToReplace;

        delete _oracles[_processor];
        _oracleAddresses.pop();

        emit RemoveProcessor(_processor);
    }

    /**
     * @dev Internal function to handle oracle data submissions
     *
     * @param _roundId the unique round identifier
     * @param _price the latest price update from processor/oracle
     */
    function _submit(uint64 _roundId, int256 _price, bool _isNew) private {
        RoundSubmission storage submission = _submissions[_roundId];

        if (submission.status[msg.sender]) revert AlreadySubmitted();

        if (_isNew) {
            submission.startedAt = uint64(block.timestamp);
            submission.timeout = uint64(block.timestamp + ROUND_EXPIRY);
        }

        submission.status[msg.sender] = true;
        submission.numerator += _price;
        submission.denominator += 1;
        submission.updatedAt = uint64(block.timestamp);

        emit Submit(msg.sender, _price);
    }

    /**
     * @dev Internal function to compute and return data for a valid round
     *
     * @param _roundId the unique round identifier
     * @return answer the computed answer in round
     * @return roundId the unique round identifier
     * @return startedAt the unix timestamp when round started
     * @return updatedAt the unix timestamp of lastest update in round
     */
    function _getRoundData(
        uint64 _roundId
    )
        private
        view
        returns (
            int256 answer,
            uint64 roundId,
            uint64 startedAt,
            uint64 updatedAt
        )
    {
        RoundSubmission storage round = _submissions[_roundId];

        if (round.startedAt == 0 || round.numerator == 0)
            revert InvalidRoundId();

        roundId = _roundId;
        answer = round.numerator / round.denominator;
        startedAt = round.startedAt;
        updatedAt = round.updatedAt;
    }
}
