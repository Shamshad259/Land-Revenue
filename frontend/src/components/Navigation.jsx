import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { navigationStyles } from '../styles/components/navigation';

const Navigation = () => {
    const navigate = useNavigate();
    const { walletAddress, userRole, contract, setWalletAddress, setUserRole } = useWallet();
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [govId, setGovId] = useState('');
    const [recoveryStatus, setRecoveryStatus] = useState({
        type: '',
        message: ''
    });

    const isLoggedIn = walletAddress && localStorage.getItem('token');

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('walletAddress');
            setWalletAddress?.('');
            setUserRole?.(null);
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleRecovery = async (e) => {
        e.preventDefault();
        setRecoveryStatus({ type: '', message: '' });
        
        try {
            if (!contract) throw new Error("Contract not initialized");
            
            const tx = await contract.initiateRecovery(govId);
            setRecoveryStatus({
                type: 'info',
                message: 'Processing recovery request...'
            });
            
            await tx.wait();
            
            setRecoveryStatus({
                type: 'success',
                message: "Recovery request initiated successfully. Please wait for collector's approval."
            });
            
            setTimeout(() => {
                setShowRecoveryModal(false);
                setGovId('');
                setRecoveryStatus({ type: '', message: '' });
            }, 2000);
            
        } catch (err) {
            let errorMessage = "Recovery failed: ";
            
            if (err.reason) {
                errorMessage += err.reason;
            } else if (err.message && err.message.includes('reason=')) {
                const match = err.message.match(/reason="([^"]+)"/);
                errorMessage += match ? match[1] : err.message;
            } else {
                errorMessage += err.message || "Unknown error occurred";
            }
            
            setRecoveryStatus({
                type: 'error',
                message: errorMessage
            });
        }
    };

    return (
        <>
            <nav style={navigationStyles.nav}>
                <div style={navigationStyles.innerContainer}>
                    <div style={navigationStyles.flexContainer}>
                        <div style={navigationStyles.logoContainer}>
                            <span onClick={() => navigate('/')} style={navigationStyles.logoClickable}>
                                <span style={navigationStyles.mainTitle}>Land Revenue</span>
                                <span style={navigationStyles.subtitle}>Management System</span>
                            </span>
                        </div>
                        
                        <div style={navigationStyles.rightSection}>
                            {!isLoggedIn ? (
                                <div style={navigationStyles.buttonGroup}>
                                    <button 
                                        onClick={() => navigate('/login')} 
                                        style={{...navigationStyles.button, ...navigationStyles.primaryButton}}
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => navigate('/register')} 
                                        style={{...navigationStyles.button, ...navigationStyles.secondaryButton}}
                                    >
                                        Register
                                    </button>
                                    <button 
                                        onClick={() => setShowRecoveryModal(true)} 
                                        style={{...navigationStyles.button, ...navigationStyles.secondaryButton}}
                                    >
                                        Recover Account
                                    </button>
                                </div>
                            ) : (
                                <div style={navigationStyles.userInfoContainer}>
                                    <div style={navigationStyles.userDetails}>
                                        <span style={navigationStyles.roleText}>
                                            {userRole || 'No Role'}
                                        </span>
                                        <span style={navigationStyles.walletText}>
                                            {walletAddress}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        style={{...navigationStyles.button, ...navigationStyles.dangerButton}}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showRecoveryModal && (
                <div style={navigationStyles.modalOverlay}>
                    <div style={navigationStyles.modalContent}>
                        <h2 style={navigationStyles.modalTitle}>Recover Account</h2>
                        <p style={navigationStyles.modalDescription}>
                            Enter your Government ID to recover your account. 
                            Make sure you're using a new wallet address.
                        </p>

                        {recoveryStatus.message && (
                            <div className={`${recoveryStatus.type}-message`}>
                                {recoveryStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleRecovery}>
                            <input
                                type="text"
                                value={govId}
                                onChange={(e) => setGovId(e.target.value)}
                                placeholder="Enter Government ID"
                                style={navigationStyles.input}
                                required
                            />
                            <div style={navigationStyles.modalButtonContainer}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRecoveryModal(false);
                                        setGovId('');
                                        setRecoveryStatus({ type: '', message: '' });
                                    }}
                                    style={{...navigationStyles.button, ...navigationStyles.secondaryButton}}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{...navigationStyles.button, ...navigationStyles.primaryButton}}
                                >
                                    Initiate Recovery
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;