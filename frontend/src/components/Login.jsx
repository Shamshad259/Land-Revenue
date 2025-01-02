import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';

const AUTH_MESSAGE = "Please sign this message to authenticate with the Land Management System";

const styles = {
    container: {
        width: '100%',
        maxWidth: '42rem',
        margin: '0 auto'
    },
    title: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '2rem',
        textAlign: 'center'
    },
    errorAlert: {
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        color: '#b91c1c',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
    },
    blockedAlert: {
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        color: '#b91c1c',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
    },
    warningAlert: {
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        color: '#92400e',
        padding: '0.75rem 1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
    },
    linkButton: {
        marginLeft: '0.5rem',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none'
        }
    },
    mainCard: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem'
    },
    connectButton: {
        width: '100%',
        background: 'linear-gradient(to right, #3b82f6, #2563eb)',
        color: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '1.125rem',
        fontWeight: '500',
        transition: 'all 200ms',
        '&:hover': {
            background: 'linear-gradient(to right, #2563eb, #1d4ed8)'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    walletInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    walletCard: {
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
    },
    walletLabel: {
        fontSize: '0.875rem',
        color: '#4b5563'
    },
    walletAddress: {
        fontFamily: 'monospace',
        color: '#1f2937',
        wordBreak: 'break-all'
    },
    roleContainer: {
        marginTop: '0.5rem',
        fontSize: '0.875rem'
    },
    roleLabel: {
        color: '#4b5563'
    },
    roleValue: {
        fontWeight: '500',
        color: '#111827'
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#16a34a'
        },
        '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
        }
    },
    registerButton: {
        width: '100%',
        backgroundColor: '#a855f7',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#9333ea'
        }
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '28rem',
        width: '100%'
    },
    modalTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
    },
    modalDescription: {
        fontSize: '0.875rem',
        color: '#4b5563',
        marginBottom: '1rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.75rem'
    },
    cancelButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#d1d5db'
        }
    },
    submitButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '0.375rem',
        '&:hover': {
            backgroundColor: '#2563eb'
        }
    }
};

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
    const [isBlocked, setIsBlocked] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [govId, setGovId] = useState('');
    const [checkingSession, setCheckingSession] = useState(true);

    // Check for existing session - only run once on mount
    useEffect(() => {
        const checkExistingSession = () => {
            try {
                const token = localStorage.getItem('token');
                const savedWallet = localStorage.getItem('walletAddress');
                
                if (token && savedWallet) {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setCheckingSession(false);
            }
        };

        checkExistingSession();
    }, []); // Only depend on navigate

    // Check user status when wallet or contract changes
    useEffect(() => {
        let isMounted = true;

        const checkUserStatus = async () => {
            try {
                if (!contract || !walletAddress) {
                    if (isMounted) {
                        setIsRegistered(true);
                        setIsBlocked(false);
                    }
                    return;
                }

                const userIdentity = await contract.userIdentities(walletAddress);
                
                if (!isMounted) return;

                // Check if account is blocked
                if (userIdentity.isBlocked) {
                    setIsBlocked(true);
                    setIsRegistered(false);
                    return;
                }

                // Check if user is registered and verified
                const isUserRegistered = userIdentity.governmentId && 
                                       userIdentity.governmentId !== "" && 
                                       userIdentity.isVerified === true;
                
                setIsRegistered(isUserRegistered);
                setIsBlocked(false);

            } catch (error) {
                console.error("Error checking user status:", error);
                if (isMounted) {
                    setIsRegistered(false);
                    setIsBlocked(false);
                }
            }
        };

        checkUserStatus();

        return () => {
            isMounted = false;
        };
    }, [contract, walletAddress]); // Only depend on contract and walletAddress

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

            if (isBlocked) {
                alert("This account has been blocked. Please use account recovery if needed.");
                return;
            }

            if (!isRegistered) {
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(AUTH_MESSAGE);

            const response = await axios.post("http://localhost:5000/api/auth/login", {
                walletAddress: walletAddress.toLowerCase(),
                signature: signature,
            });

            const { token } = response.data.data;
            
            localStorage.setItem("token", token);
            localStorage.setItem("walletAddress", walletAddress.toLowerCase());

            navigate("/dashboard");
        } catch (error) {
            console.error('Login error:', error);
            // Handle specific error cases here
        }
    };

    // Don't render anything while checking session
    if (checkingSession) {
        return null; // or return a loading spinner
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Login with Wallet
            </h1>

            {error && (
                <div style={styles.errorAlert}>
                    {error}
                </div>
            )}

            {isBlocked && walletAddress && (
                <div style={styles.blockedAlert}>
                    This wallet has been blocked.
                    <button
                        onClick={() => setShowRecoveryModal(true)}
                        style={styles.linkButton}
                    >
                        Recover Account
                    </button>
                </div>
            )}

            {!isRegistered && walletAddress && !isBlocked && (
                <div style={styles.warningAlert}>
                    This wallet is not registered yet.
                    <button
                        onClick={() => navigate('/register')}
                        style={styles.linkButton}
                    >
                        Register now
                    </button>
                </div>
            )}

            <div style={styles.mainCard}>
                {!walletAddress ? (
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        style={styles.connectButton}
                    >
                        {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                ) : (
                    <div style={styles.walletInfoContainer}>
                        <div style={styles.walletCard}>
                            <div style={styles.walletLabel}>Connected Wallet</div>
                            <div style={styles.walletAddress}>{walletAddress}</div>
                            {userRole && (
                                <div style={styles.roleContainer}>
                                    <span style={styles.roleLabel}>Role: </span>
                                    <span style={styles.roleValue}>{userRole}</span>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={handleLogin}
                            disabled={isLoading || !isRegistered || isBlocked}
                            style={styles.loginButton}
                        >
                            {isLoading ? "Processing..." : "Login with Wallet"}
                        </button>

                        {!isRegistered && !isBlocked && (
                            <button
                                onClick={() => navigate('/register')}
                                style={styles.registerButton}
                            >
                                Register Your Wallet
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showRecoveryModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Recover Account</h2>
                        <p style={styles.modalDescription}>
                            Enter your Government ID to recover your account. 
                            Make sure you're using a new wallet address.
                        </p>
                        <form onSubmit={handleRecovery}>
                            <input
                                type="text"
                                value={govId}
                                onChange={(e) => setGovId(e.target.value)}
                                placeholder="Enter Government ID"
                                style={styles.input}
                                required
                            />
                            <div style={styles.modalButtonContainer}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRecoveryModal(false);
                                        setGovId('');
                                    }}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={styles.submitButton}
                                >
                                    Initiate Recovery
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;