import '../../../styles/dashboard.css';

const PendingSales = ({ sales, loading, handleApproveSale }) => {
    if (loading) {
        return <div className="loading-text">Loading...</div>;
    }

    return (
        <div className="pending-group">
            <div className="actions-list">
                {sales.map((sale) => (
                    <div key={sale.thandaperNumber} className="action-item">
                        <div className="action-info">
                            <div className="info-row">
                                <span className="action-label">Land ID:</span>
                                <span className="action-value">
                                    {sale.thandaperNumber}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="action-label">From:</span>
                                <span className="action-value">
                                    {`${sale.seller.slice(0, 6)}...${sale.seller.slice(-4)}`}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="action-label">To:</span>
                                <span className="action-value">
                                    {`${sale.buyer.slice(0, 6)}...${sale.buyer.slice(-4)}`}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="action-label">Title:</span>
                                <span className="action-value">
                                    {sale.landTitle}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleApproveSale(sale.thandaperNumber)}
                            className="approve-button"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Approve Sale'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingSales;
