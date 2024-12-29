import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

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

// Role mapping
const Roles = {
    None: 0,
    ChiefSecretary: 1,
    Collector: 2,
    Tahsildar: 3,
    VillageOfficer: 4,
    SubRegistrar: 5,
    SeniorRegistrar: 6,
    LandOwner: 7
};

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [contract, setContract] = useState(null);

    // Initialize contract
    const initializeContract = async (provider) => {
        try {
            // Replace with your contract address and ABI
            const contractAddress = "YOUR_CONTRACT_ADDRESS";
            const contractABI = []; // Your contract ABI here
            
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

    // Get user's role from contract
    const fetchUserRole = async (address, contract) => {
        try {
            const roleNumber = await contract.userRoles(address);
            const role = Object.keys(Roles).find(
                key => Roles[key] === roleNumber.toNumber()
            );
            setUserRole(role);
            return role;
        } catch (error) {
            console.error("Error fetching user role:", error);
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

            // Switch to Hardhat network
            await switchToHardhatNetwork();

            // Request account access
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            const address = accounts[0];
            setWalletAddress(address);

            // Initialize provider and contract
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contractInstance = await initializeContract(provider);

            // Fetch user role
            await fetchUserRole(address, contractInstance);

            return address;
        } catch (error) {
            setError("Failed to connect wallet: " + error.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Check if user has required role
    const checkRole = (requiredRoles) => {
        if (!userRole) return false;
        return requiredRoles.includes(userRole);
    };

    // Listen for network changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    if (contract) {
                        await fetchUserRole(accounts[0], contract);
                    }
                } else {
                    setWalletAddress("");
                    setUserRole(null);
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
        isLoading,
        error,
        userRole,
        contract,
        setError,
        setIsLoading,
        connectWallet,
        checkRole
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