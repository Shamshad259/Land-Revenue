import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';
import { registerStyles } from '../styles/components/register';

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
    const [registrationStatus, setRegistrationStatus] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedWallet = localStorage.getItem('walletAddress');
        
        if (token && savedWallet) {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Check if the government ID is already registered
    const checkGovIdExists = async (govId) => {
        try {
            return await contract.isGovIdRegistered(govId);
        } catch (error) {
            console.error("Error checking government ID:", error);
            throw error; 
        }
    };

    // Check if wallet address is already registered
    const checkWalletRegistration = async (address) => {
        try {
            const userIdentity = await contract.userIdentities(address);
            return {
                isVerified: userIdentity.isVerified,
                isBlocked: userIdentity.isBlocked,
                governmentId: userIdentity.governmentId
            };
        } catch (error) {
            return {
                isVerified: false,
                isBlocked: false,
                governmentId: ""
            };
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistrationStatus(null);
        
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

            // Check if government ID is already registered
            const govIdExists = await checkGovIdExists(govId);
            if (govIdExists) {
                setRegistrationStatus({
                    type: 'error',
                    message: 'This Government ID is already registered. Please use account recovery if needed.'
                });
                return;
            }

            // Check wallet registration status
            const walletStatus = await checkWalletRegistration(walletAddress);
            if (walletStatus.isVerified) {
                setRegistrationStatus({
                    type: 'error',
                    message: 'This wallet is already registered. Please proceed to login.'
                });
                navigate('/login');
                return;
            }

            if (walletStatus.isBlocked) {
                setRegistrationStatus({
                    type: 'error',
                    message: 'This wallet is blocked. Please use a different wallet address.'
                });
                return;
            }

            // Get fresh provider and signer
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // Create a new contract instance with signer
            const contractWithSigner = contract.connect(signer);

            // Register user with explicit gas limit
            const tx = await contractWithSigner.registerUser(govId, {
                gasLimit: 500000
            });

            setRegistrationStatus({
                type: 'info',
                message: 'Transaction submitted. Waiting for confirmation...'
            });

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                setRegistrationStatus({
                    type: 'success',
                    message: 'Registration successful! Please proceed to login.'
                });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            
            let errorMessage = "Registration failed: ";
            
            if (error.code === 'ACTION_REJECTED') {
                errorMessage += "Transaction was rejected in MetaMask";
            } else if (error.message.includes("User already registered")) {
                errorMessage += "This wallet is already registered";
            } else if (error.message.includes("Government ID already registered")) {
                errorMessage += "This Government ID is already registered";
            } else {
                errorMessage += error.message || "Unknown error occurred";
            }

            setRegistrationStatus({
                type: 'error',
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={registerStyles.container}>
            <h1 style={registerStyles.title}>Register New Account</h1>

            {error && (
                <div style={registerStyles.errorAlert}>
                    {error}
                </div>
            )}

            {registrationStatus && (
                <div style={registerStyles.statusAlert(registrationStatus.type)}>
                    {registrationStatus.message}
                </div>
            )}

            {!walletAddress ? (
                <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    style={{
                        ...registerStyles.connectButton,
                        ...(isLoading && { opacity: 0.5, cursor: 'not-allowed' })
                    }}
                >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
            ) : (
                <form onSubmit={handleRegister} style={registerStyles.form}>
                    <div style={registerStyles.walletInfoCard}>
                        <div style={registerStyles.walletLabel}>Connected Wallet:</div>
                        <div style={registerStyles.walletAddress}>{walletAddress}</div>
                    </div>

                    <div style={registerStyles.inputContainer}>
                        <label style={registerStyles.label}>
                            Government ID
                        </label>
                        <input
                            type="text"
                            value={govId}
                            onChange={(e) => setGovId(e.target.value)}
                            style={registerStyles.input}
                            placeholder="Enter your Government ID"
                            required
                        />
                        <p style={registerStyles.helperText}>
                            This ID will be used for account recovery if needed
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        style={{
                            ...registerStyles.registerButton,
                            ...(isLoading || isSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                        }}
                    >
                        {isSubmitting ? "Processing..." : "Register Account"}
                    </button>

                    <div style={registerStyles.loginSection}>
                        Already registered?{" "}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            style={registerStyles.loginLink}
                        >
                            Login here
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Register;