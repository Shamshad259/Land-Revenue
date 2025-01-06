import { landownerDashboardStyles } from '../../../styles/components/landowner-dashboard';

const PendingPurchases = ({ sales, walletAddress, handleConfirmByBuyer }) => {
    const filteredSales = sales.filter(sale => 
        sale.saleStatus.buyer.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!filteredSales.length) return null;

    return (
        <div style={landownerDashboardStyles.section}>
            <h2 style={landownerDashboardStyles.sectionTitle}>Pending Purchases</h2>
            {filteredSales.map(sale => (
                <div key={sale.thandaperNumber} style={landownerDashboardStyles.saleCard}>
                    <h3 style={landownerDashboardStyles.landTitle}>Land: {sale.landTitle}</h3>
                    <div style={landownerDashboardStyles.saleInfo}>
                        <p>Thandaper Number: {sale.thandaperNumber}</p>
                        <p>Seller: {`${sale.saleStatus.seller.slice(0, 6)}...${sale.saleStatus.seller.slice(-4)}`}</p>
                        <p>Status: {
                            sale.saleStatus.registrarApproved ? "Approved" :
                            sale.saleStatus.buyerConfirmed ? "Waiting for Registrar" :
                            sale.saleStatus.sellerConfirmed ? "Waiting for Your Confirmation" :
                            "Waiting for Seller Confirmation"
                        }</p>
                    </div>
                    
                    {!sale.saleStatus.buyerConfirmed && sale.saleStatus.sellerConfirmed && (
                        <button 
                            onClick={() => handleConfirmByBuyer(sale.thandaperNumber)}
                            style={landownerDashboardStyles.confirmButton}
                        >
                            Confirm Purchase
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PendingPurchases;
