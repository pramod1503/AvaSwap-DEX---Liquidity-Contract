// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAvaSwapFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);
    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
    function allPairsLength() external view returns (uint);
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}
