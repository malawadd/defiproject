//SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import {DataTypes} from "./libraries/DataTypes.sol";
import {Errors} from "./libraries/Errors.sol";
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title A decentralized Tameen (insurance) protocol
/// @author Mohammed Alawad
/// @notice You can use this contract for creating and requesting your own Tameen contracts.

contract Taamin {
    uint16 public id ;
    address tokenAddress;
    AggregatorV3Interface internal priceFeed;
    IERC20 internal taaminToken;

    mapping(uint16 => DataTypes.PoolData) public poolDataList;
    mapping(uint16 => mapping(address => DataTypes.PoolLiquiditySupply)) public poolLiquiditySupply;
    mapping(uint16 => mapping(address => DataTypes.InsuranceRequest)) public insuranceRequests;




    event PoolUpdated();
    event TaaminRequestCreated();

    modifier existPool(uint16 _id){
        if (_id > id) {
            revert Errors.PoolIdNotExist();
        }
        _;

    }

    constructor(){
        id = 0;
    }


    /// @notice retrives the lates price from price feed
    /// @dev reccomended way to retrieve the price from the price feed acccording to Chainlink docs.
    /// @return token price with decimals based on price feed

    function getLatestPrice() internal view returns (int256){
        
    }

    /// @notice Calculate the amount of fees to be paid by user to request an Tameen
    /// @param _id the id of the pool that users wants to insure
    /// @param _amount the amount of token that the user wants to insure
    /// @return the amount of fee to be paid by user to request an Tameen in 10**18
    function getUserFee(uint16 _id, uint256 _amount) public view returns (uint256){
        
    }

    /// @notice Calculate the requested amount of reimbursement to be paid by user when the Tameen criterias are met
    /// @param _id the id of the pool to calculate reimbursement
    /// @param _amount the amount of token to calculate reimbursement
    /// @return the amount of to be paid to user when Tameen criteria are met in 10**18
    function getReimbursement(uint16 _id, uint256 _amount) public view returns (uint256){
        
    }


    /// @notice generates a new Tameen pool with the given parameters
    /// @dev each pool has a unique id that it is increased by 1 for each new pool. Also, a struct is created for each pool and asseciated to it throug a mapping called poolDataList
    /// @param _tokenAddress The ERC20 token address that the pool will be based on
    /// @param _priceFeed The address of the price feed contract
    /// @param _insuranceLossCoverage The percentage of loss cover that the user wants to have for the selected token. The input 10 for example represents that the Tameen will cover a price loss of 10%
    /// @param _fee The percentage of fee that it will be charged to the user to request an Tameen
    /// @param _startDateFromDeployInSeconds The beginning of the Tameen validity period in seconds from the deployment of the pool. The validity period is the period of time where the Tameen is active and no more users/investors can partecipate to the Tameen pool.
    /// @param _endDateFromDeployInSeconds The end of the Tameen validity period in seconds from the deployment of the pool. The validity period is the period of time where the Tameen is active and no more users/investors can partecipate to the Tameen pool.
    /// @return the pool data in a struct format
    function initPool(
        address _tokenAddress,
        address _priceFeed,
        int256 _insuranceLossCoverage,
        uint8 _fee,
        uint256 _startDateFromDeployInSeconds,
        uint256 _endDateFromDeployInSeconds
     ) public returns (DataTypes.PoolData memory){

    }


    /// @notice It allows the user to add new liquidity to the selected Tameen pool
    /// @dev the function transfers the amount of token to the pool and updates the pool data. this requires a separate erc20 approve to allow this contract to spend the token in the name of the user
    /// @param _id the id of the pool to add new liquidity
    /// @param _amount the amount of token to add to the Tameen pool
    /// @return the liquidity amount supplied to the Tameen pool

    function supplyPool(uint16 _id, uint256 _amount) public existPool(_id) returns (uint256){
        
    }

    /// @notice It allows the Tameen provider to withdraw liquidity at the end of the Tameen validity period
    /// @param _id the id of the pool to withdraw liquidity

    function withdrawPool(uint16 _id) public existPool(_id) {
        
    }

     /// @notice It allows the user to request a Tameen from one of the existing Tameen pools
    /// @dev there is one check in the function to validate that the user has the balance of the token to cover the Tameen. This is done to avoid users misusing the Tameen contract and requesting an Tameen for an amount they don't have. However, this check is only at the moment of the request. If the user withdraws the Tameen before the end of the validity period, the check is not performed. It is a security gap
    /// @param _id the id of the pool to request an Tameen
    /// @param _amount the amount of token to request an Tameen for

    function requestInsurance(uint16 _id, uint256 _amount) public existPool(_id) {
        
    }

    /// @notice It allows the Tameen requester to ask and then receive the reimbursement of the Tameen when the criteria are met
    /// @dev only the Tameen requester can ask for its own reimbursement
    /// @param _id the id of the pool to request for reimbursement

    function requestReimbursement(uint16 _id) public existPool(_id) {
        
    }





















}

