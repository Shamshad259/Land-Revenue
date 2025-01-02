import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';

const styles = {
    container: {
        padding: '1.5rem',
        maxWidth: '28rem',
        margin: '0 auto'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem'
    },
    errorAlert: {
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        color: '#b91c1c',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
    },
    statusAlert: (type) => ({
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        border: '1px solid',
        ...{
            'error': {
                backgroundColor: '#fee2e2',
                borderColor: '#ef4444',
                color: '#b91c1c'
            },
            'success': {
                backgroundColor: '#dcfce7',
                borderColor: '#22c55e',
                color: '#15803d'
            },
            'info': {
                backgroundColor: '#dbeafe',
                borderColor: '#3b82f6',
                color: '#1e40af'
            }
        }[type]
    }),
    connectButton: {
        width: '100%',
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        border: 'none',
        '&:hover': {
            backgroundColor: '#2563eb'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    walletInfoCard: {
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.375rem',
        wordBreak: 'break-all'
    },
    walletLabel: {
        fontSize: '0.875rem',
        color: '#4b5563',
        marginBottom: '0.25rem'
    },
    walletAddress: {
        fontFamily: 'monospace',
        fontSize: '0.875rem'
    },
    inputContainer: {
        marginBottom: '1rem'
    },
    label: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        outline: 'none',
        '&:focus': {
            borderColor: '#a855f7',
            boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.2)'
        }
    },
    helperText: {
        marginTop: '0.25rem',
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#a855f7',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#9333ea'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    loginSection: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    loginLink: {
        color: '#a855f7',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        '&:hover': {
            color: '#9333ea'
        }
    }
};
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
            const address = await contract.govIdToAddress(govId);
            return address !== ethers.ZeroAddress;
        } catch (error) {
            console.error("Error checking government ID:", error);
            return false;
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
        <div style={styles.container}>
            <h1 style={styles.title}>Register New Account</h1>

            {error && (
                <div style={styles.errorAlert}>
                    {error}
                </div>
            )}

            {registrationStatus && (
                <div style={styles.statusAlert(registrationStatus.type)}>
                    {registrationStatus.message}
                </div>
            )}

            {!walletAddress ? (
                <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    style={{
                        ...styles.connectButton,
                        ...(isLoading && { opacity: 0.5, cursor: 'not-allowed' })
                    }}
                >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
            ) : (
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.walletInfoCard}>
                        <div style={styles.walletLabel}>Connected Wallet:</div>
                        <div style={styles.walletAddress}>{walletAddress}</div>
                    </div>

                    <div style={styles.inputContainer}>
                        <label style={styles.label}>
                            Government ID
                        </label>
                        <input
                            type="text"
                            value={govId}
                            onChange={(e) => setGovId(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your Government ID"
                            required
                        />
                        <p style={styles.helperText}>
                            This ID will be used for account recovery if needed
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        style={{
                            ...styles.registerButton,
                            ...(isLoading || isSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                        }}
                    >
                        {isSubmitting ? "Processing..." : "Register Account"}
                    </button>

                    <div style={styles.loginSection}>
                        Already registered?{" "}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            style={styles.loginLink}
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