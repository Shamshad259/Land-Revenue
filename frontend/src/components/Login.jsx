import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { useWallet } from '../context/WalletContext';
import { loginStyles } from '../styles/components/login';

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
    }, []); 

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

                if (userIdentity.isBlocked) {
                    setIsBlocked(true);
                    setIsRegistered(false);
                    return;
                }

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
    }, [contract, walletAddress]); 
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
        }
    };

    if (checkingSession) {
        return null; 
    }

    return (
        <div style={loginStyles.container}>
            <h1 style={loginStyles.title}>
                Login with Wallet
            </h1>

            {error && (
                <div style={loginStyles.errorAlert}>
                    {error}
                </div>
            )}

            {isBlocked && walletAddress && (
                <div style={loginStyles.blockedAlert}>
                    This wallet has been blocked.
                    <button
                        onClick={() => setShowRecoveryModal(true)}
                        style={loginStyles.linkButton}
                    >
                        Recover Account
                    </button>
                </div>
            )}

            {!isRegistered && walletAddress && !isBlocked && (
                <div style={loginStyles.warningAlert}>
                    This wallet is not registered yet.
                    <button
                        onClick={() => navigate('/register')}
                        style={loginStyles.linkButton}
                    >
                        Register now
                    </button>
                </div>
            )}

            <div style={loginStyles.mainCard}>
                {!walletAddress ? (
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        style={loginStyles.connectButton}
                    >
                        {isLoading ? "Connecting..." : "Connect Wallet"}
                    </button>
                ) : (
                    <div style={loginStyles.walletInfoContainer}>
                        <div style={loginStyles.walletCard}>
                            <div style={loginStyles.walletLabel}>Connected Wallet</div>
                            <div style={loginStyles.walletAddress}>{walletAddress}</div>
                            {userRole && (
                                <div style={loginStyles.roleContainer}>
                                    <span style={loginStyles.roleLabel}>Role: </span>
                                    <span style={loginStyles.roleValue}>{userRole}</span>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={handleLogin}
                            disabled={isLoading || !isRegistered || isBlocked}
                            style={loginStyles.loginButton}
                        >
                            {isLoading ? "Processing..." : "Login with Wallet"}
                        </button>

                        {!isRegistered && !isBlocked && (
                            <button
                                onClick={() => navigate('/register')}
                                style={loginStyles.registerButton}
                            >
                                Register Your Wallet
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showRecoveryModal && (
                <div style={loginStyles.modalOverlay}>
                    <div style={loginStyles.modalContent}>
                        <h2 style={loginStyles.modalTitle}>Recover Account</h2>
                        <p style={loginStyles.modalDescription}>
                            Enter your Government ID to recover your account. 
                            Make sure you're using a new wallet address.
                        </p>
                        <form onSubmit={handleRecovery}>
                            <input
                                type="text"
                                value={govId}
                                onChange={(e) => setGovId(e.target.value)}
                                placeholder="Enter Government ID"
                                style={loginStyles.input}
                                required
                            />
                            <div style={loginStyles.modalButtonContainer}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRecoveryModal(false);
                                        setGovId('');
                                    }}
                                    style={loginStyles.cancelButton}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={loginStyles.submitButton}
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