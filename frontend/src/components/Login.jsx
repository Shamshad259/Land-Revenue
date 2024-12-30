import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';

const AUTH_MESSAGE = "Please sign this message to authenticate with the Land Management System";

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
    const [isRegistered, setIsRegistered] = useState(true);

    // Add check for existing session
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedWallet = localStorage.getItem('walletAddress');
        
        if (token && savedWallet) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const checkRegistrationStatus = async () => {
        try {
            const userIdentity = await contract.userIdentities(walletAddress);
            return userIdentity && 
                   userIdentity.governmentId && 
                   userIdentity.governmentId !== "" && 
                   userIdentity.isVerified === true;
        } catch (error) {
            return false;
        }
    };

    const handleLogin = async () => {
        try {
            if (!walletAddress) {
                await connectWallet();
                return;
            }

            if (!contract) {
                alert('Please wait for contract initialization or try refreshing the page');
                return;
            }

            const registered = await checkRegistrationStatus();
            if (!registered) {
                setIsRegistered(false);
                return;
            }

            // Get provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Sign authentication message
            const signature = await signer.signMessage(AUTH_MESSAGE);

            // Send to backend
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                walletAddress: walletAddress.toLowerCase(),
                signature: signature,
            });

            const { token } = response.data.data;
            
            localStorage.setItem("token", token);
            localStorage.setItem("walletAddress", walletAddress.toLowerCase());

            navigate("/dashboard");
        } catch (error) {
            if (error.code === 'BAD_DATA') {
                setIsRegistered(false);
            } else if (error.response) {
                alert(error.response.data.error || "Login failed");
            } else {
                alert(error.message || "Login failed");
            }
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Login with Wallet
            </h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!isRegistered && walletAddress && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    This wallet is not registered yet.
                    <button
                        onClick={handleRegisterClick}
                        className="ml-2 underline hover:no-underline"
                    >
                        Register now
                    </button>
                </div>
            )}

            <div className="bg-white rounded-lg p-8">
                {!walletAddress ? (
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 text-lg font-medium"
                    >
                        {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                ) : (
                    <div className="space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">Connected Wallet</div>
                            <div className="font-mono text-gray-800 break-all">{walletAddress}</div>
                            {userRole && (
                                <div className="mt-2 text-sm">
                                    <span className="text-gray-600">Role: </span>
                                    <span className="font-medium text-gray-900">{userRole}</span>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={handleLogin}
                            disabled={isLoading || !isRegistered}
                            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                        >
                            {isLoading ? "Processing..." : "Login with Wallet"}
                        </button>

                        {!isRegistered && (
                            <button
                                onClick={handleRegisterClick}
                                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                            >
                                Register Your Wallet
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;