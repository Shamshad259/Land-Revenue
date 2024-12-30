import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';

const Register = () => {
    const navigate = useNavigate();
    const { 
        walletAddress, 
        isLoading, 
        error, 
        connectWallet,
        contract 
    } = useWallet();
    
    const [govId, setGovId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedWallet = localStorage.getItem('walletAddress');
        
        if (token && savedWallet) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            if (!walletAddress) {
                await connectWallet();
                return;
            }

            if (!contract) {
                throw new Error("Contract is not initialized");
            }

            if (!govId.trim()) {
                throw new Error("Please enter your Government ID");
            }

            // Check if user is already registered - More robust check
            try {
                const userIdentity = await contract.userIdentities(walletAddress);
                console.log("Checking existing registration:", userIdentity);
                
                if (userIdentity && userIdentity.isVerified) {
                    alert("This wallet is already registered. Please proceed to login.");
                    navigate('/login');
                    return;
                }
            } catch (error) {
                // Only proceed if the error is due to user not existing
                if (!error.message.includes('could not decode')) {
                    throw error;
                }
            }

            // Get fresh provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // Create a new contract instance with signer
            const contractWithSigner = contract.connect(signer);

            // Send transaction with explicit gas limit
            const tx = await contractWithSigner.registerUser(govId, {
                gasLimit: 500000 // Higher gas limit to ensure transaction goes through
            });

            console.log("Waiting for transaction confirmation...");
            const receipt = await tx.wait();

            if (receipt.status === 1) { // 1 = success
                alert("Registration successful! Please proceed to login.");
                navigate("/login");
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            
            if (error.code === 'ACTION_REJECTED') {
                alert("Transaction was rejected in MetaMask");
            } else if (error.message.includes("User already registered")) {
                alert("This wallet is already registered. Please proceed to login.");
                navigate('/login');
            } else if (error.message.includes("Internal JSON-RPC error")) {
                alert("Transaction failed. This wallet might already be registered or there was a network error.");
            } else {
                alert(
                    `Registration failed: ${error.message || "Unknown error"}. ` +
                    "Please make sure you have enough ETH and try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Register New Account</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!walletAddress ? (
                <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded break-words">
                        Connected: {walletAddress}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Government ID
                        </label>
                        <input
                            type="text"
                            value={govId}
                            onChange={(e) => setGovId(e.target.value)}
                            className="input-field"
                            placeholder="Enter your Government ID"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                        {isSubmitting ? "Processing..." : "Register Account"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;