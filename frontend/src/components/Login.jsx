import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';

const AUTH_MESSAGE = "Please sign this message to authenticate with our application";

const Login = () => {
    const navigate = useNavigate();
    const { 
        walletAddress, 
        isLoading, 
        error, 
        userRole, 
        connectWallet,
        contract 
    } = useWallet();

    const handleLogin = async () => {
        try {
            if (!walletAddress) {
                await connectWallet();
                return;
            }

            // Get provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Check if user is registered in the contract
            const userIdentity = await contract.userIdentities(walletAddress);
            
            if (!userIdentity.isVerified) {
                navigate('/register');
                return;
            }

            if (userIdentity.isBlocked) {
                throw new Error('This account has been blocked');
            }

            // Sign authentication message
            const signature = await signer.signMessage(AUTH_MESSAGE);

            // Send to backend
            const response = await axios.post("http://localhost:5000/login", {
                walletAddress,
                signature,
                role: userRole
            });

            const { token } = response.data.data;
            
            // Store auth data
            localStorage.setItem("token", token);
            localStorage.setItem("walletAddress", walletAddress);

            navigate("/protected");
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.error || error.message || "Login failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Login with Wallet</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!walletAddress ? (
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded break-words">
                        <div>Connected: {walletAddress}</div>
                        {userRole && (
                            <div className="mt-2 text-sm text-gray-600">
                                Role: {userRole}
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : "Login with Wallet"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;