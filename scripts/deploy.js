const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AvaSwap contracts...");

  const [deployer] = await ethers.getSigners();

  // Deploy Factory
  const Factory = await ethers.getContractFactory("AvaSwapFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("✅ Factory deployed at:", factoryAddress);

  // Deploy mock tokens
  const Token = await ethers.getContractFactory("ERC20Mock");
  const HYK = await Token.deploy("HYK Token", "HYK");
  await HYK.waitForDeployment();
  console.log("🪙 HYK deployed at:", await HYK.getAddress());

  const USDT = await Token.deploy("USDT Token", "USDT");
  await USDT.waitForDeployment();
  console.log("🪙 USDT deployed at:", await USDT.getAddress());

  // Mint tokens
  await HYK.mint(deployer.address, ethers.parseEther("1000"));
  await USDT.mint(deployer.address, ethers.parseEther("1000"));
  console.log("💰 Tokens minted to deployer.");

  // Create pair
  const tx = await factory.createPair(await HYK.getAddress(), await USDT.getAddress());
  const receipt = await tx.wait();

  // Decode PairCreated event
  const iface = factory.interface;
  const log = receipt.logs.find((l) => l.address === factoryAddress);

  if (log) {
    const parsed = iface.parseLog(log);
    console.log("🔗 Pair created:", parsed.args.pair);
  } else {
    console.log("⚠️ Could not find PairCreated event in logs.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
