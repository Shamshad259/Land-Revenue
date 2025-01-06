import { landownerDashboardStyles } from '../../../styles/components/landowner-dashboard';

const PendingSales = ({ sales, handleConfirmSale, getSaleStatus }) => {
    if (!sales.length) {
        return <div style={landownerDashboardStyles.emptyText}>No pending sales</div>;
    }

    return (
        <table style={landownerDashboardStyles.table}>
            <thead>
                <tr>
                    <th style={landownerDashboardStyles.th}>Land ID</th>
                    <th style={landownerDashboardStyles.th}>Buyer</th>
                    <th style={landownerDashboardStyles.th}>Status</th>
                    <th style={landownerDashboardStyles.th}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sales.map((sale) => (
                    <tr key={sale.thandaperNumber}>
                        <td style={landownerDashboardStyles.td}>{sale.thandaperNumber}</td>
                        <td style={landownerDashboardStyles.td}>
                            {sale.saleStatus?.buyer ? 
                                `${sale.saleStatus.buyer.slice(0, 6)}...${sale.saleStatus.buyer.slice(-4)}` 
                                : 'N/A'}
                        </td>
                        <td style={landownerDashboardStyles.td}>
                            {getSaleStatus(sale)}
                        </td>
                        <td style={landownerDashboardStyles.td}>
                            {!sale.saleStatus?.sellerConfirmed && (
                                <button
                                    onClick={() => handleConfirmSale(sale.thandaperNumber)}
                                    style={{...landownerDashboardStyles.button, ...landownerDashboardStyles.greenButton}}
                                >
                                    Confirm Sale
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PendingSales;
