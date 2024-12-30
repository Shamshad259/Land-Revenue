# Land Management System 🏗️

A blockchain-based land management system built with Hardhat, Ethereum smart contracts, and Vite frontend.

Last Updated: December 30, 2024

## 🚀 Features

- Smart contract-based land record management
- Role-based access control
- Frontend interface built with Vite
- Backend server with Node.js
- Local blockchain development environment
- Comprehensive testing suite

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity
- **Blockchain Development:** Hardhat
- **Frontend:** Vite
- **Backend:** Node.js
- **Testing:** Hardhat Test Suite
- **Other Tools:** 
  - TypeScript
  - Ethers.js v6
  - Hardhat Ignition
  - Solidity Coverage

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- Yarn package manager
- A Web3 wallet (e.g., MetaMask)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Shamshad259/Land-Revenue.git
cd land-management
Install dependencies:
yarn install
Create a .env file in the root directory (see .env.example for required variables)
💻 Usage
Development
Start the local Hardhat node:

yarn nodeRun
Deploy contracts to local network:

yarn deploy:local
Setup roles:

yarn setup:roles
Start the backend server:

yarn dev:backend
Start the frontend development server:

yarn dev
Testing
Run the test suite:

yarn test
Generate coverage report:

yarn hardhat coverage
Building for Production
Build the frontend:

yarn build
📝 Available Scripts
yarn start:backend - Start the backend server
yarn dev:backend - Start the backend server with nodemon
yarn compile - Compile smart contracts
yarn deploy:local - Deploy contracts to local network
yarn nodeRun - Start local Hardhat node
yarn setup:roles - Setup roles in the contract
yarn test - Run tests
yarn dev - Start frontend development server
yarn build - Build frontend for production
🔍 Project Structure
Code
land-management/
├── frontend/         # Vite frontend application
├── backend/         # Node.js backend server
├── contracts/       # Solidity smart contracts
├── scripts/         # Deployment and setup scripts
├── test/           # Test files
└── hardhat.config.js