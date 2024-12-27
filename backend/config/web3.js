// config/web3.js
import { ethers } from "ethers";
import dotenv from 'dotenv';
import { abi } from "./contract.js";

dotenv.config();

if (!process.env.CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS not found in environment variables');
}

const setupProvider = () => {
    try {
        // Create a StaticJsonRpcProvider instead of JsonRpcProvider
        const provider = new ethers.providers.StaticJsonRpcProvider(
            "http://127.0.0.1:8545",
            {
                chainId: 31337,
                name: 'hardhat',
                ensAddress: null // Explicitly disable ENS
            }
        );

        // Add error handling
        provider.on("error", (error) => {
            console.error("Provider Error:", error);
        });

        return provider;
    } catch (error) {
        console.error("Failed to setup provider:", error);
        throw error;
    }
};

const setupContract = (provider) => {
    try {
        return new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            abi,
            provider
        );
    } catch (error) {
        console.error("Failed to setup contract:", error);
        throw error;
    }
};

// Initialize provider and contract
const provider = setupProvider();
const contract = setupContract(provider);

// Simple connection check
const checkConnection = async () => {
    try {
        const network = await provider.getNetwork();
        console.log("Connected to network:", {
            name: network.name,
            chainId: network.chainId
        });
        
        // Basic contract check
        const code = await provider.getCode(process.env.CONTRACT_ADDRESS);
        if (code === '0x') {
            console.warn('Warning: No contract code at specified address');
        }
    } catch (error) {
        console.error("Connection check failed:", error);
    }
};

// Run connection check but don't block exports
checkConnection();

export { provider, contract };