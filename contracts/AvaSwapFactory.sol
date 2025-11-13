// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IAvaSwapFactory.sol";
import "./AvaSwapPair.sol";

contract AvaSwapFactory is IAvaSwapFactory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    
    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    
// crate New pair of Toekn0 and Token1
    function createPair(address token0, address token1) external override returns (address pair) {
        if(token0 == token1) {
            revert("AvaSwap: IDENTICAL_ADDRESSES");
        }
        if(getPair[token0][token1] != address(0)) {
            revert("AvaSwap: PAIR_EXISTS");
        }
        (address tokenA, address tokenB) = token0 < token1 ? (token0, token1) : (token1, token0);

        bytes memory bytecode = type(AvaSwapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));

        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        // initialize the pair
        IAvaPair(pair).initialize(tokenA, tokenB);

        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair;
        allPairs.push(pair);

        emit PairCreated(tokenA, tokenB, pair, allPairs.length);
    } 

    function setFeeTo(address _feeTo) external override {
        if(msg.sender != feeToSetter) {
            revert("AvaSwap: FORBIDDEN");
        }
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        if(msg.sender != feeToSetter) {
            revert("AvaSwap: FORBIDDEN");
        }
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view override returns (uint) {
        return allPairs.length;
    }


}
