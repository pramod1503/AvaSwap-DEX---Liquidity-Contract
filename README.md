🦄 AvaSwap DEX (Custom Fee DEX)

AvaSwap is a Uniswap V2–style decentralized exchange (DEX) built entirely from scratch using Solidity and Hardhat.
It supports liquidity provision, token swaps, and LP (liquidity provider) tokens — demonstrating a deep understanding of AMM mechanics, pair creation, and ERC20 token management.

🧠 Core Concept

This project replicates the core functionality of Uniswap V2, including:

🧩 Token Pair Creation (Factory + Pair system)

💧 Liquidity Provision & Removal

🔄 Token Swapping using constant product formula (x * y = k)

🪙 LP Token Minting & Burning

⚙️ Customizable Fee Logic

🧪 Complete Testing with Hardhat

It’s designed for learning, showcasing, and extending to your own custom fee DEX.

🧱 Project Structure
LIquidity-Contract/
│
├── contracts/
│   ├── AvaSwapFactory.sol          # Deploys and tracks token pairs
│   ├── AvaSwapPair.sol             # Handles liquidity, swaps, LP logic
│   ├── tokens/
│   │   ├── ERC20Mock.sol           # Simple ERC20 tokens for testing
│   ├── interfaces/
│   │   ├── IAvaFactory.sol
│   │   └── IAvaPair.sol
│   └── libraries/
│       └── Math.sol                # Math utilities (min, sqrt)
│
├── scripts/
│   └── deploy.js                   # Deploy factory + example pairs
│
├── test/
│   └── AvaSwap.test.js             # Full test suite for DEX logic
│
├── hardhat.config.js               # Hardhat setup
├── package.json
└── README.md

⚙️ Setup Instructions
1️⃣ Install Dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts

2️⃣ Compile Contracts
npx hardhat compile

3️⃣ Run Tests
npx hardhat test


