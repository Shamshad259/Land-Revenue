import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import axios from 'axios';

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem'
    },
    header: {
        marginBottom: '2rem'
    },
    headerTitle: {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    headerSubtitle: {
        color: '#6b7280',
        marginTop: '0.5rem'
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
    },
    actionButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#2563eb'
        }
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
    },
    formTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1f2937'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
        }
    },
    select: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        backgroundColor: 'white',
        fontSize: '0.875rem',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
        }
    },
    submitButton: {
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        gridColumn: 'span 2',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#16a34a'
        }
    },
    pendingSection: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#1f2937'
    },
    loadingText: {
        color: '#6b7280',
        textAlign: 'center',
        padding: '1rem'
    },
    pendingList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    subsectionTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '0.5rem'
    },
    headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
    },
    userInfo: {
        color: '#6b7280',
        fontSize: '0.875rem'
    },
    spinner: {
        width: '1.5rem',
        height: '1.5rem',
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '0.5rem',
        display: 'inline-block'
    },
    pendingGroup: {
        marginBottom: '1.5rem'
    },
    actionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    actionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb'
    },
    actionInfo: {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '0.5rem',
        alignItems: 'center'
    },
    actionLabel: {
        color: '#4b5563',
        fontWeight: '500',
        fontSize: '0.875rem'
    },
    actionValue: {
        color: '#111827',
        fontSize: '0.875rem'
    },
    actionButtons: {
        display: 'flex',
        gap: '0.5rem'
    },
    approveButton: {
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#16a34a'
        }
    },
    rejectButton: {
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#dc2626'
        }
    },
    emptyState: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '2rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb'
    }
};

const OfficialDashboard = () => {
    const { userRole, contract, walletAddress } = useWallet();
    const [loading, setLoading] = useState(true);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showSetRoleForm, setShowSetRoleForm] = useState(false);
    const [showRecoveryForm, setShowRecoveryForm] = useState(false);
    const [showBlockForm, setShowBlockForm] = useState(false);

    const [formData, setFormData] = useState({
        // Land Registration
        thandaperNumber: '',
        owner: '',
        taluk: '',
        village: '',
        surveyNumber: '',
        area: '',
        landTitle: '',
        geoLocation: '',
        marketValue: '',
        // Role Management
        userAddress: '',
        role: '1', // Default to ChiefSecretary
        // Recovery/Block
        govId: '',
        userToUnblock: ''
    });

    const roleOptions = {
        ChiefSecretary: '1',
        Collector: '2',
        Registrar: '3',
        LandOwner: '4'
    };

    // Pending actions state
    const [pendingActions, setPendingActions] = useState({
        sales: [],
        recoveries: [],
        blockedAccounts: []
    });

    useEffect(() => {
        if (contract && userRole === 'Registrar') {
            // Listen for relevant events
            const filters = [
                contract.filters.SaleRequested(),
                contract.filters.SaleConfirmedBySeller(),
                contract.filters.SaleConfirmedByBuyer(),
                contract.filters.SaleApprovedByRegistrar()
            ];
    
            filters.forEach(filter => {
                contract.on(filter, () => {
                    fetchPendingActions(); // Refresh when any sale-related event occurs
                });
            });
    
            return () => {
                filters.forEach(filter => {
                    contract.off(filter);
                });
            };
        }
    }, [contract, userRole]);
    const fetchPendingActions = async () => {
        if (!contract) return;
    
        try {
            setLoading(true);
            
            // For Registrar - Fetch Pending Sales
            if (userRole === 'Registrar') {
                const landIds = await contract.getLands();
                
                const salesPromises = landIds.map(async (landId) => {
                    try {
                        const sale = await contract.saleRequests(landId);
                        
                        // Only return valid sale requests that need registrar approval
                        if (sale.buyer !== ethers.ZeroAddress && 
                            sale.sellerConfirmed && 
                            sale.buyerConfirmed && 
                            !sale.registrarApproved) {
                            
                            return {
                                thandaperNumber: landId.toString(),
                                seller: sale.seller,
                                buyer: sale.buyer,
                                sellerConfirmed: sale.sellerConfirmed,
                                buyerConfirmed: sale.buyerConfirmed
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching sale request for land ${landId}:`, error);
                    }
                    return null;
                });
    
                const sales = (await Promise.all(salesPromises)).filter(sale => sale !== null);
                setPendingActions(prev => ({ ...prev, sales }));
            }
    
        } catch (error) {
            console.error("Error fetching pending actions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Chief Secretary Actions
    const handleSetUserRole = async (e) => {
        e.preventDefault();
        try {
            const tx = await contract.setUserRole(
                formData.userAddress,
                Number(formData.role)
            );
            await tx.wait();
            setShowSetRoleForm(false);
            // Show success message
        } catch (error) {
            console.error("Error setting user role:", error);
        }
    };

    // Registrar Actions
    const handleRegisterLand = async (e) => {
        e.preventDefault();
        try {
            const tx = await contract.registerLand(
                ethers.getBigInt(formData.thandaperNumber),
                formData.owner,
                formData.taluk,
                formData.village,
                ethers.getBigInt(formData.surveyNumber),
                ethers.parseUnits(formData.area, 'ether'),
                formData.landTitle,
                formData.geoLocation,
                ethers.parseUnits(formData.marketValue, 'ether')
            );
            await tx.wait();
            setShowRegisterForm(false);
        } catch (error) {
            console.error("Error registering land:", error);
        }
    };

    const handleApproveSale = async (thandaperNumber) => {
        try {
            if (!contract) throw new Error("Contract not initialized");
    
            // Show loading state
            setLoading(true);
    
            const tx = await contract.approveSaleByRegistrar(
                ethers.getBigInt(thandaperNumber)
            );
            
            // Wait for transaction confirmation
            await tx.wait();
            
            // Show success message
            alert("Sale approved successfully!");
            
            // Refresh the pending actions
            await fetchPendingActions();
        } catch (error) {
            console.error("Error approving sale:", error);
            alert(`Failed to approve sale: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Collector Actions
    const handleApproveRecovery = async (govId) => {
        try {
            const tx = await contract.approveRecovery(govId);
            await tx.wait();
            fetchPendingActions();
        } catch (error) {
            console.error("Error approving recovery:", error);
        }
    };

    const handleBlockAccount = async (e) => {
        e.preventDefault();
        try {
            const tx = await contract.blockAccount(formData.govId);
            await tx.wait();
            setShowBlockForm(false);
            fetchPendingActions();
        } catch (error) {
            console.error("Error blocking account:", error);
        }
    };

    const handleUnblockAccount = async (userAddress) => {
        try {
            const tx = await contract.unblockAccount(userAddress);
            await tx.wait();
            fetchPendingActions();
        } catch (error) {
            console.error("Error unblocking account:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
    <div style={styles.headerTop}>
        <div style={styles.headerTitle}>
            {userRole} Dashboard
        </div>
        <div style={styles.userInfo}>
            {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        </div>
    </div>
    <p style={styles.headerSubtitle}>
        Manage land revenue operations and approvals
    </p>
</div>
    
            {/* Action Buttons */}
            <div style={styles.buttonGrid}>
                {userRole === 'ChiefSecretary' && (
                    <button
                        onClick={() => setShowSetRoleForm(!showSetRoleForm)}
                        style={styles.actionButton}
                    >
                        Set User Role
                    </button>
                )}
                
                {userRole === 'Registrar' && (
                    <button
                        onClick={() => setShowRegisterForm(!showRegisterForm)}
                        style={styles.actionButton}
                    >
                        Register New Land
                    </button>
                )}
    
                {userRole === 'Collector' && (
                    <>
                        <button
                            onClick={() => setShowBlockForm(!showBlockForm)}
                            style={styles.actionButton}
                        >
                            Block/Unblock Account
                        </button>
                        <button
                            onClick={() => setShowRecoveryForm(!showRecoveryForm)}
                            style={styles.actionButton}
                        >
                            Handle Recovery Requests
                        </button>
                    </>
                )}
            </div>
    
            {/* Forms Section */}
            {userRole === 'Registrar' && showRegisterForm && (
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>Register New Land</h2>
                    <form onSubmit={handleRegisterLand} style={styles.formGrid}>
                        <input
                            type="text"
                            name="thandaperNumber"
                            value={formData.thandaperNumber}
                            onChange={handleInputChange}
                            placeholder="Thandaper Number"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="owner"
                            value={formData.owner}
                            onChange={handleInputChange}
                            placeholder="Owner Address"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="taluk"
                            value={formData.taluk}
                            onChange={handleInputChange}
                            placeholder="Taluk"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="village"
                            value={formData.village}
                            onChange={handleInputChange}
                            placeholder="Village"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="surveyNumber"
                            value={formData.surveyNumber}
                            onChange={handleInputChange}
                            placeholder="Survey Number"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            placeholder="Area (in ETH units)"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="landTitle"
                            value={formData.landTitle}
                            onChange={handleInputChange}
                            placeholder="Land Title"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="geoLocation"
                            value={formData.geoLocation}
                            onChange={handleInputChange}
                            placeholder="Geo Location"
                            style={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="marketValue"
                            value={formData.marketValue}
                            onChange={handleInputChange}
                            placeholder="Market Value (in ETH)"
                            style={styles.input}
                            required
                        />
                        <button
                            type="submit"
                            style={styles.submitButton}
                        >
                            Register Land
                        </button>
                    </form>
                </div>
            )}
    
            {/* Set Role Form */}
            {userRole === 'ChiefSecretary' && showSetRoleForm && (
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>Set User Role</h2>
                    <form onSubmit={handleSetUserRole} style={styles.formGrid}>
                        <input
                            type="text"
                            name="userAddress"
                            value={formData.userAddress}
                            onChange={handleInputChange}
                            placeholder="User Address"
                            style={styles.input}
                            required
                        />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            style={styles.select}
                            required
                        >
                            {Object.entries(roleOptions).map(([role, value]) => (
                                <option key={value} value={value}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            style={{...styles.submitButton, gridColumn: 'span 2'}}
                        >
                            Set Role
                        </button>
                    </form>
                </div>
            )}
    
            {/* Block Account Form */}
            {userRole === 'Collector' && showBlockForm && (
                <div style={styles.formCard}>
                    <h2 style={styles.formTitle}>Block Account</h2>
                    <form onSubmit={handleBlockAccount} style={styles.formGrid}>
                        <input
                            type="text"
                            name="govId"
                            value={formData.govId}
                            onChange={handleInputChange}
                            placeholder="Government ID"
                            style={styles.input}
                            required
                        />
                        <button
                            type="submit"
                            style={{...styles.submitButton, gridColumn: 'span 1'}}
                        >
                            Block Account
                        </button>
                    </form>
                </div>
            )}
    
            {/* Pending Actions Section */}
<div style={styles.pendingSection}>
    <h2 style={styles.sectionTitle}>Pending Actions</h2>
    {loading ? (
        <div style={styles.loadingText}>
            <div style={styles.spinner}></div>
            Loading...
        </div>
    ) : (
        <div style={styles.pendingList}>
            {/* Registrar - Pending Sales */}
            {userRole === 'Registrar' && pendingActions.sales.length > 0 && (
                <div style={styles.pendingGroup}>
                    <h3 style={styles.subsectionTitle}>Pending Sales</h3>
                    <div style={styles.actionsList}>
                        {pendingActions.sales.map((sale) => (
                            <div key={sale.thandaperNumber} style={styles.actionItem}>
                                <div style={styles.actionInfo}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>Land ID:</span>
                                        <span style={styles.actionValue}>{sale.thandaperNumber}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>From:</span>
                                        <span style={styles.actionValue}>
                                            {`${sale.seller.slice(0, 6)}...${sale.seller.slice(-4)}`}
                                        </span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>To:</span>
                                        <span style={styles.actionValue}>
                                            {`${sale.buyer.slice(0, 6)}...${sale.buyer.slice(-4)}`}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApproveSale(sale.thandaperNumber)}
                                    style={styles.approveButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Approve Sale'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collector - Pending Recoveries */}
            {userRole === 'Collector' && pendingActions.recoveries.length > 0 && (
                <div style={styles.pendingGroup}>
                    <h3 style={styles.subsectionTitle}>Pending Recoveries</h3>
                    <div style={styles.actionsList}>
                        {pendingActions.recoveries.map((recovery) => (
                            <div key={recovery.govId} style={styles.actionItem}>
                                <div style={styles.actionInfo}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>Government ID:</span>
                                        <span style={styles.actionValue}>{recovery.govId}</span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>New Address:</span>
                                        <span style={styles.actionValue}>
                                            {`${recovery.newAddress.slice(0, 6)}...${recovery.newAddress.slice(-4)}`}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApproveRecovery(recovery.govId)}
                                    style={styles.approveButton}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Approve Recovery'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collector - Blocked Accounts */}
            {userRole === 'Collector' && pendingActions.blockedAccounts.length > 0 && (
                <div style={styles.pendingGroup}>
                    <h3 style={styles.subsectionTitle}>Blocked Accounts</h3>
                    <div style={styles.actionsList}>
                        {pendingActions.blockedAccounts.map((account) => (
                            <div key={account.address} style={styles.actionItem}>
                                <div style={styles.actionInfo}>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>Address:</span>
                                        <span style={styles.actionValue}>
                                            {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                                        </span>
                                    </div>
                                    <div style={styles.infoRow}>
                                        <span style={styles.actionLabel}>Government ID:</span>
                                        <span style={styles.actionValue}>{account.govId}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleUnblockAccount(account.address)}
                                    style={{...styles.approveButton, ...styles.unblockButton}}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Unblock Account'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Pending Actions Message */}
            {!pendingActions.sales.length && 
             !pendingActions.recoveries.length && 
             !pendingActions.blockedAccounts.length && (
                <div style={styles.emptyState}>
                    No pending actions at this time
                </div>
            )}
        </div>
    )}
</div>
        </div>
    );
};

export default OfficialDashboard;