import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../constants/ABI.json';

// Hardhat network configuration
const HARDHAT_NETWORK = {
    chainId: '0x7A69', // 31337 in hex
    chainName: 'Hardhat Local',
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    }
};

// Role mapping from your contract
const Roles = {
    None: 0,
    ChiefSecretary: 1,
    Collector: 2,
    Registrar: 3,
    LandOwner: 4
};

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [contract, setContract] = useState(null);
    const [userIdentity, setUserIdentity] = useState(null);

    // Initialize contract with ethers v6
    const initializeContract = async (provider) => {
        try {
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
            const contractABI = abi.abi;
            
            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                provider
            );
            
            setContract(contract);
            return contract;
        } catch (error) {
            console.error("Contract initialization error:", error);
            throw error;
        }
    };

    // Add Hardhat network to MetaMask
    const addHardhatNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [HARDHAT_NETWORK],
            });
        } catch (error) {
            console.error("Failed to add Hardhat network:", error);
            throw error;
        }
    };

    // Switch to Hardhat network
    const switchToHardhatNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: HARDHAT_NETWORK.chainId }],
            });
        } catch (error) {
            if (error.code === 4902) {
                await addHardhatNetwork();
                await switchToHardhatNetwork();
            } else {
                throw error;
            }
        }
    };

    // Get user's identity and role from contract
    const fetchUserDetails = async (address, contract) => {
        try {
            const [userIdentity, roleNumber] = await Promise.all([
                contract.userIdentities(address),
                contract.userRoles(address)
            ]);

            // Store user identity
            setUserIdentity({
                governmentId: userIdentity.governmentId,
                isVerified: userIdentity.isVerified,
                isBlocked: userIdentity.isBlocked
            });

            // Set user role
            const roleValue = Number(roleNumber);
            const role = Object.keys(Roles).find(
                key => Roles[key] === roleValue
            );
            setUserRole(role);

            return { role, userIdentity };
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    };

    // Connect wallet function
    const connectWallet = async () => {
        try {
            setIsLoading(true);
            setError("");

            if (typeof window.ethereum === "undefined") {
                throw new Error("Please install MetaMask");
            }

            await switchToHardhatNetwork();

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            const address = accounts[0];
            setWalletAddress(address);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contractInstance = await initializeContract(signer);

            await fetchUserDetails(address, contractInstance);

            return address;
        } catch (error) {
            setError("Failed to connect wallet: " + error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Check if user has required role and is verified/not blocked
    const checkRole = (requiredRoles) => {
        if (!userRole || !userIdentity) return false;
        if (userIdentity.isBlocked) return false;
        if (!userIdentity.isVerified) return false;
        return requiredRoles.includes(userRole);
    };

    // Get user's owned lands
    const getOwnedLands = async (address) => {
        try {
            if (!contract) throw new Error("Contract not initialized");
            const lands = await contract.getOwnedLands(address);
            return lands.map(land => land.toString());
        } catch (error) {
            console.error("Error fetching owned lands:", error);
            throw error;
        }
    };

    // Prepare transaction data
    const prepareTransaction = async (methodName, ...params) => {
        try {
            if (!contract) throw new Error("Contract not initialized");
            return {
                methodName,
                params,
                to: contract.target
            };
        } catch (error) {
            console.error("Error preparing transaction:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    if (contract) {
                        await fetchUserDetails(accounts[0], contract);
                    }
                } else {
                    setWalletAddress("");
                    setUserRole(null);
                    setUserIdentity(null);
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", () => {});
            }
        };
    }, [contract]);

    const value = {
        walletAddress,
        setWalletAddress,
        isLoading,
        error,
        userRole,
        setUserRole,
        userIdentity,
        contract,
        setError,
        setIsLoading,
        connectWallet,
        checkRole,
        getOwnedLands,
        prepareTransaction,
        Roles // Export Roles enum for use in components
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};