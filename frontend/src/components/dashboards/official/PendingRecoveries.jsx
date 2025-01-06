import '../../../styles/dashboard.css';

const PendingRecoveries = ({ recoveries, loading, handleApproveRecovery }) => {
    if (!recoveries.length) return null;

    return (
        <div className="dashboard-form-card">
            <h3 className="form-title">Pending Account Recovery Requests</h3>
            <div className="recovery-list">
                {recoveries.map((recovery, index) => (
                    <div key={`${recovery.govId}-${recovery.newAddress}-${index}`} className="recovery-item">
                        <div className="recovery-details">
                            <div className="recovery-header">
                                <span className="recovery-id">Recovery Request #{index + 1}</span>
                                <span className="recovery-timestamp">
                                    {new Date(Number(recovery.timestamp) * 1000).toLocaleString()}
                                </span>
                            </div>
                            
                            <div className="recovery-info">
                                <div className="info-group">
                                    <label>Government ID:</label>
                                    <span>{recovery.govId}</span>
                                </div>
                                <div className="info-group">
                                    <label>New Wallet Address:</label>
                                    <span className="address">
                                        {`${recovery.newAddress.slice(0, 6)}...${recovery.newAddress.slice(-4)}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="recovery-actions">
                            <button
                                onClick={() => handleApproveRecovery(recovery.govId)}
                                className="approve-button"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Approve Recovery'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingRecoveries;
