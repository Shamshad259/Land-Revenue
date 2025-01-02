import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const styles = {
    nav: {
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50
    },
    innerContainer: {
        width: '100%',
        maxWidth: '2000px',
        margin: '0 auto',
        padding: '0 2rem',
    },
    flexContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        height: '4rem'
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    logoClickable: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    mainTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    subtitle: {
        fontSize: '0.875rem',
        marginLeft: '0.5rem',
        color: '#6b7280',
        fontWeight: '500'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem'
    },
    button: {
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s'
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
    },
    secondaryButton: {
        backgroundColor: '#e5e7eb',
        color: '#374151',
    },
    dangerButton: {
        backgroundColor: '#ef4444',
        color: 'white',
    },
    userInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
    },
    userDetails: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    roleText: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#111827'
    },
    walletText: {
        fontSize: '0.75rem',
        color: '#6b7280',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: '200px',
        whiteSpace: 'nowrap'
    },
    // Modal styles
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
    }
};

const Navigation = () => {
    const navigate = useNavigate();
    const { walletAddress, userRole, contract, setWalletAddress, setUserRole } = useWallet();
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);
    const [govId, setGovId] = useState('');
    const [recoveryError, setRecoveryError] = useState('');

    // Add this to check if user is actually logged in
    const isLoggedIn = walletAddress && localStorage.getItem('token');

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('walletAddress');
            
            if (typeof setWalletAddress === 'function') {
                setWalletAddress('');
            }
            
            if (typeof setUserRole === 'function') {
                setUserRole(null);
            }
            
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    const handleRecovery = async (e) => {
        e.preventDefault();
        try {
            if (!contract) throw new Error("Contract not initialized");
            
            const tx = await contract.initiateRecovery(govId);
            await tx.wait();
            
            alert("Recovery request initiated. Please wait for collector's approval.");
            setShowRecoveryModal(false);
            setGovId('');
        } catch (error) {
            setRecoveryError(error.message);
        }
    };

    return (
        <>
           <nav style={styles.nav}>
            <div style={styles.innerContainer}>
                <div style={styles.flexContainer}>
                    <div style={styles.logoContainer}>
                        <span onClick={() => navigate('/')} style={styles.logoClickable}>
                            <span style={styles.mainTitle}>Land Revenue</span>
                            <span style={styles.subtitle}>Management System</span>
                        </span>
                    </div>
                    
                    <div style={styles.rightSection}>
                        {!isLoggedIn ? ( // Changed from !walletAddress to !isLoggedIn
                            <div style={styles.buttonGroup}>
                                <button 
                                    onClick={() => navigate('/login')} 
                                    style={{...styles.button, ...styles.primaryButton}}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => navigate('/register')} 
                                    style={{...styles.button, ...styles.secondaryButton}}
                                >
                                    Register
                                </button>
                                <button 
                                    onClick={() => setShowRecoveryModal(true)} 
                                    style={{...styles.button, ...styles.secondaryButton}}
                                >
                                    Recover Account
                                </button>
                            </div>
                        ) : (
                            <div style={styles.userInfoContainer}>
                                <div style={styles.userDetails}>
                                    <span style={styles.roleText}>
                                        {userRole || 'No Role'}
                                    </span>
                                    <span style={styles.walletText}>
                                        {walletAddress}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleLogout} 
                                    style={{...styles.button, ...styles.dangerButton}}
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
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Recover Account</h2>
                        <p style={styles.modalDescription}>
                            Enter your Government ID to recover your account. 
                            Make sure you're using a new wallet address.
                        </p>
                        {recoveryError && (
                            <div style={{color: '#ef4444', marginBottom: '1rem'}}>
                                {recoveryError}
                            </div>
                        )}
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
                                        setRecoveryError('');
                                    }}
                                    style={{...styles.button, ...styles.secondaryButton}}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{...styles.button, ...styles.primaryButton}}
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