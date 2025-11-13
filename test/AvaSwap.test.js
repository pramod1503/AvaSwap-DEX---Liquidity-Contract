const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AvaSwap DEX", function () {
  let deployer, user1;
  let factory, tokenA, tokenB, pair;

  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();

    // Deploy Factory
    const Factory = await ethers.getContractFactory("AvaSwapFactory");
    factory = await Factory.deploy(deployer.address);
    await factory.waitForDeployment();

    // Deploy two mock tokens
    const Token = await ethers.getContractFactory("ERC20Mock");
    tokenA = await Token.deploy("TokenA", "TKA");
    await tokenA.waitForDeployment();

    tokenB = await Token.deploy("TokenB", "TKB");
    await tokenB.waitForDeployment();

    // Mint tokens
    await tokenA.mint(deployer.address, ethers.parseEther("1000"));
    await tokenB.mint(deployer.address, ethers.parseEther("1000"));

    // Create pair
    const tx = await factory.createPair(await tokenA.getAddress(), await tokenB.getAddress());
    const receipt = await tx.wait();

    // Decode PairCreated event from logs
    const event = receipt.logs
      .map((log) => {
        try {
          return factory.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "PairCreated");

    const pairAddress = event.args.pair;
    pair = await ethers.getContractAt("AvaSwapPair", pairAddress);
  });

  it("should deploy tokens and factory correctly", async () => {
    expect(await tokenA.name()).to.equal("TokenA");
    expect(await tokenB.symbol()).to.equal("TKB");
    expect(await factory.allPairsLength()).to.equal(1n);
  });

  it("should create a pair and initialize tokens", async () => {
    expect(await pair.token0()).to.not.equal(ethers.ZeroAddress);
    expect(await pair.token1()).to.not.equal(ethers.ZeroAddress);
  });

  it("should allow liquidity deposit", async () => {
  const amountA = ethers.parseEther("100");
  const amountB = ethers.parseEther("100");

  await tokenA.approve(await pair.getAddress(), amountA);
  await tokenB.approve(await pair.getAddress(), amountB);

  await tokenA.transfer(await pair.getAddress(), amountA);
  await tokenB.transfer(await pair.getAddress(), amountB);

  // Mint LP tokens for deployer
  await pair.mint(deployer.address);

  expect(await pair.balanceOf(deployer.address)).to.be.greaterThan(0n);
});

it("should update reserves after liquidity is added", async () => {
  const amountA = ethers.parseEther("50");
  const amountB = ethers.parseEther("50");

  await tokenA.transfer(await pair.getAddress(), amountA);
  await tokenB.transfer(await pair.getAddress(), amountB);
  await pair.mint(deployer.address);

  const reserves = await pair.getReserves();
  expect(reserves._reserve0).to.equal(amountA);
  expect(reserves._reserve1).to.equal(amountB);
});


it("should allow liquidity removal (burn)", async function () {
  const amountA = ethers.parseUnits("10", 18);
  const amountB = ethers.parseUnits("10", 18);

  await tokenA.transfer(pair.target, amountA);
  await tokenB.transfer(pair.target, amountB);
  await pair.mint(deployer.address);

  const liquidity = await pair.balanceOf(deployer.address);
  expect(liquidity).to.be.gt(0n);

  await pair.transfer(pair.target, liquidity);
  await pair.burn(deployer.address);

  const reserves = await pair.getReserves();
  expect(reserves._reserve0).to.equal(0);
  expect(reserves._reserve1).to.equal(0);
});

});
