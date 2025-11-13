// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAvaPair {
    function initialize(address, address) external;
    function getReserves() external view returns (uint112, uint112, uint32);
    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to) external;
    function sync() external;
}
