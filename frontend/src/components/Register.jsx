import { useState } from "react";
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

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            if (!walletAddress) {
                await connectWallet();
                return;
            }

            if (!govId.trim()) {
                throw new Error("Please enter your Government ID");
            }

            // Get registration transaction data from backend
            const response = await axios.post("http://localhost:5000/register", {
                walletAddress,
                govId
            });

            const txData = response.data.data;

            // Get the provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Send the registration transaction
            const tx = await contract.connect(signer).registerUser(govId);

            // Wait for transaction confirmation
            await tx.wait();

            alert("Registration successful! Please proceed to login.");
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.response?.data?.error || error.message || "Registration failed");
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
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
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