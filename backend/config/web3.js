import { ethers } from "ethers";
import dotenv from 'dotenv';
import { abi } from "./contract.js";

dotenv.config();

if (!process.env.CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS not found in environment variables');
}

const setupProvider = () => {
    try {
        // In v6, JsonRpcProvider is used differently and StaticJsonRpcProvider is removed
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545",
            {
                chainId: 31337,
                name: 'hardhat'
                // ensAddress is no longer needed in v6
            }
        );

        // Error handling remains similar
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
        // Contract creation syntax remains the same
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

// Connection check with v6 syntax
const checkConnection = async () => {
    try {
        const network = await provider.getNetwork();
        console.log("Connected to network:", {
            name: network.name,
            chainId: network.chainId
        });
        
        // Basic contract check remains similar
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