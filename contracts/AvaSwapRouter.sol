// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IAvaSwapFactory.sol";
import "./interfaces/IAvaPair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AvaSwapRouter {
    address public factory;

    constructor(address _factory) {
        factory = _factory;
    }

    // ✅ Add liquidity
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired
    ) external returns (uint liquidity) {
        // 1. Get pair from factory or create it
        address pair = IAvaSwapFactory(factory).getPair(tokenA, tokenB);
        if (pair == address(0)) {
            pair = IAvaSwapFactory(factory).createPair(tokenA, tokenB);
        }

        // 2. Transfer tokens from user to pair contract
        IERC20(tokenA).transferFrom(msg.sender, pair, amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, pair, amountBDesired);

        // 3. Call mint() on pair (which will update reserves)
        liquidity = IAvaPair(pair).mint(msg.sender);
    }

    // ✅ Swap tokens
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to
    ) external {
        require(path.length == 2, "Only two-token swap supported");

        address input = path[0];
        address output = path[1];

        address pair = IAvaSwapFactory(factory).getPair(input, output);
        require(pair != address(0), "Pair does not exist");

        IERC20(input).transferFrom(msg.sender, pair, amountIn);

        (uint reserveIn, uint reserveOut,) = IAvaPair(pair).getReserves();

        uint amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        require(amountOut >= amountOutMin, "Insufficient output amount");

        IAvaPair(pair).swap(0, amountOut,  to);
    }

    // ✅ Swap formula
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {
        uint amountInWithFee = amountIn * 997; // 0.3% fee
        uint numerator = amountInWithFee * reserveOut;
        uint denominator = reserveIn * 1000 + amountInWithFee;
        amountOut = numerator / denominator;
    }
}
