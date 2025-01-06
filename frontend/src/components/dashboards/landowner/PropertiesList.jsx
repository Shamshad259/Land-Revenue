import { ethers } from 'ethers';
import { landownerDashboardStyles } from '../../../styles/components/landowner-dashboard';

const PropertiesList = ({ lands, loading, handleSell }) => {
    if (loading) {
        return <div style={landownerDashboardStyles.loadingText}>Loading properties...</div>;
    }

    if (!lands.length) {
        return <div style={landownerDashboardStyles.emptyText}>No properties found</div>;
    }

    return (
        <table style={landownerDashboardStyles.table}>
            <thead>
                <tr>
                    <th style={landownerDashboardStyles.th}>Thandaper Number</th>
                    <th style={landownerDashboardStyles.th}>Title</th>
                    <th style={landownerDashboardStyles.th}>Survey Number</th>
                    <th style={landownerDashboardStyles.th}>Area</th>
                    <th style={landownerDashboardStyles.th}>Village</th>
                    <th style={landownerDashboardStyles.th}>Taluk</th>
                    <th style={landownerDashboardStyles.th}>Market Value</th>
                    <th style={landownerDashboardStyles.th}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {lands.map((land) => (
                    <tr key={land.thandaperNumber}>
                        <td style={landownerDashboardStyles.td}>{land.thandaperNumber}</td>
                        <td style={landownerDashboardStyles.td}>{land.landTitle}</td>
                        <td style={landownerDashboardStyles.td}>{land.surveyNumber}</td>
                        <td style={landownerDashboardStyles.td}>{ethers.formatEther(land.area)} sq ft</td>
                        <td style={landownerDashboardStyles.td}>{land.village}</td>
                        <td style={landownerDashboardStyles.td}>{land.taluk}</td>
                        <td style={landownerDashboardStyles.td}>{ethers.formatEther(land.marketValue)}</td>
                        <td style={landownerDashboardStyles.td}>
                            <button 
                                onClick={() => handleSell(land.thandaperNumber)}
                                style={{...landownerDashboardStyles.button, ...landownerDashboardStyles.blueButton}}
                            >
                                Sell
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PropertiesList;
