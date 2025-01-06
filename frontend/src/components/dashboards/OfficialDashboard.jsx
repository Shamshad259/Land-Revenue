import { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import '../../styles/dashboard.css';
import { officialDashboardStyles } from '../../styles/components/official-dashboard'; 
import { useOfficialActions } from '../../hooks/useOfficialActions';
import { useOfficialHandlers } from '../../hooks/useOfficialHandlers';
import LandRegistrationForm from './official/LandRegistrationForm';
import RoleManagementForm from './official/RoleManagementForm';
import PendingSales from './official/PendingSales';
import PendingRecoveries from './official/PendingRecoveries';

const OfficialDashboard = () => {
    const { userRole, contract, walletAddress } = useWallet();
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showSetRoleForm, setShowSetRoleForm] = useState(false);
    const [formData, setFormData] = useState({
        thandaperNumber: '',
        owner: '',
        taluk: '',
        village: '',
        surveyNumber: '',
        area: '',
        landTitle: '',
        geoLocation: '',
        marketValue: '',
        userAddress: '',
        role: '1',
        govId: '',
        userToUnblock: ''
    });

    const { loading, pendingActions, fetchPendingActions } = useOfficialActions(contract, userRole);
    const { 
        handleRegisterLand, 
        handleApproveSale, 
        handleApproveRecovery, 
        handleSetUserRole,
    } = useOfficialHandlers(contract, userRole, fetchPendingActions);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1 className="header-title">{userRole} Dashboard</h1>
                        <p className="header-subtitle">
                            Manage land revenue operations and approvals
                        </p>
                    </div>
                    <div className="wallet-display">
                        {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                    </div>
                </div>
            </div>

            <div className="button-grid">
                {userRole === 'ChiefSecretary' && (
                    <button
                        onClick={() => setShowSetRoleForm(!showSetRoleForm)}
                        className="dashboard-button"
                    >
                        Set User Role
                    </button>
                )}
                
                {userRole === 'Registrar' && (
                    <button
                        onClick={() => setShowRegisterForm(!showRegisterForm)}
                        className="dashboard-button"
                    >
                        Register New Land
                    </button>
                )}

            </div>
    
            {/* Forms Section */}
            {userRole === 'Registrar' && showRegisterForm && (
                <LandRegistrationForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleRegisterLand={async (formData) => { 
                        try {
                            await handleRegisterLand(formData);
                            setShowRegisterForm(false);
                            setFormData({
                                ...formData,
                                thandaperNumber: '',
                                owner: '',
                                taluk: '',
                                village: '',
                                surveyNumber: '',
                                area: '',
                                landTitle: '',
                                geoLocation: '',
                                marketValue: ''
                            });
                        } catch (error) {
                            throw error; 
                        }
                    }}
                />
            )}

            {userRole === 'ChiefSecretary' && showSetRoleForm && (
                <RoleManagementForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSetUserRole={async (formData) => {  
                        try {
                            await handleSetUserRole(formData.userAddress, formData.role);
                            setShowSetRoleForm(false);
                        } catch (error) {
                            console.error("Set role error:", error);
                        }
                    }}
                />
            )}
    
            {/* Pending Actions Section */}
            <div className="pending-actions">
                <h2 className="actions-title">Pending Actions</h2>
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        Loading...
                    </div>
                ) : (
                    <div className="actions-list">
                        {userRole === 'Registrar' && (
                            <PendingSales 
                                sales={pendingActions.sales}
                                loading={loading}
                                handleApproveSale={handleApproveSale}
                            />
                        )}

                        {userRole === 'Collector' && (
                            <PendingRecoveries 
                                recoveries={pendingActions.recoveries}
                                loading={loading}
                                handleApproveRecovery={handleApproveRecovery}
                            />
                        )}

                        {!pendingActions.sales.length && 
                         !pendingActions.recoveries.length && (
                            <div className="empty-state">
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