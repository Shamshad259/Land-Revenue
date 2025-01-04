import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { debounce } from 'lodash';

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px'
    },
    header: {
        marginBottom: '32px'
    },
    headerTitle: {
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#1f2937'
    },
    headerSubtitle: {
        color: '#4b5563',
        marginTop: '8px'
    },
    buttonSection: {
        marginBottom: '16px'
    },
    button: {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '8px',
        transition: 'background-color 0.2s'
    },
    greenButton: {
        backgroundColor: '#22c55e',
        color: 'white'
    },
    blueButton: {
        backgroundColor: '#3b82f6',
        color: 'white'
    },
    grayButton: {
        backgroundColor: '#6b7280',
        color: 'white'
    },
    form: {
        marginBottom: '32px',
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    formTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #d1d5db',
        borderRadius: '6px'
    },
    section: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px'
    },
    table: {
        width: '100%',
        backgroundColor: 'white',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '8px',
        textAlign: 'left',
        borderBottom: '1px solid #e5e7eb'
    },
    td: {
        padding: '8px',
        textAlign: 'left',
        borderBottom: '1px solid #e5e7eb'
    },
    emptyText: {
        color: '#6b7280'
    },
    loadingText: {
        color: '#6b7280',
        textAlign: 'center',
        padding: '16px'
    },
    saleCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
    },
    confirmButton: {
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '8px'
    }
};

const LandOwnerDashboard = () => {
    const { contract, walletAddress } = useWallet();
    const [lands, setLands] = useState([]);
    const [pendingSales, setPendingSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [formData, setFormData] = useState({
        thandaperNumber: '',
        buyer: ''
    });
    const [error, setError] = useState(null);

    // Debounced fetch function to prevent too many calls
    const debouncedFetch = debounce(async () => {
        try {
            if (!contract || !walletAddress) {
                setError("Wallet not connected");
                return;
            }

            setLoading(true);
            setError(null);

            // Get owned lands
            const ownedLandIds = await contract.getOwnedLands(walletAddress);
            
            // Fetch details for owned lands
            const ownedLandsPromises = ownedLandIds.map(async (id) => {
                try {
                    const [landDetails, saleRequest] = await Promise.all([
                        contract.getLandDetails(id),
                        contract.saleRequests(id)
                    ]);

                    return {
                        thandaperNumber: id.toString(),
                        owner: landDetails[0],
                        taluk: landDetails[1],
                        village: landDetails[2],
                        surveyNumber: landDetails[3].toString(),
                        area: landDetails[4].toString(),
                        landTitle: landDetails[5],
                        ownershipStartTime: new Date(Number(landDetails[6]) * 1000),
                        geoLocation: landDetails[7],
                        marketValue: landDetails[8].toString(),
                        saleStatus: {
                            inProgress: saleRequest && saleRequest.buyer !== ethers.ZeroAddress,
                            buyer: saleRequest?.buyer || ethers.ZeroAddress,
                            seller: saleRequest?.seller || ethers.ZeroAddress,
                            sellerConfirmed: saleRequest?.sellerConfirmed || false,
                            buyerConfirmed: saleRequest?.buyerConfirmed || false,
                            registrarApproved: saleRequest?.registrarApproved || false
                        }
                    };
                } catch (error) {
                    console.warn(`Error fetching land ${id}:`, error);
                    return null;
                }
            });

            // Get all lands to check for pending purchases
            const maxLandId = 100; // Adjust based on your needs
            const allLandsPromises = Array.from({ length: maxLandId }, async (_, i) => {
                const id = i + 1;
                try {
                    const saleRequest = await contract.saleRequests(id);
                    if (saleRequest.buyer.toLowerCase() === walletAddress.toLowerCase()) {
                        const landDetails = await contract.getLandDetails(id);
                        return {
                            thandaperNumber: id.toString(),
                            owner: landDetails[0],
                            taluk: landDetails[1],
                            village: landDetails[2],
                            surveyNumber: landDetails[3].toString(),
                            area: landDetails[4].toString(),
                            landTitle: landDetails[5],
                            ownershipStartTime: new Date(Number(landDetails[6]) * 1000),
                            geoLocation: landDetails[7],
                            marketValue: landDetails[8].toString(),
                            saleStatus: {
                                inProgress: true,
                                buyer: saleRequest.buyer,
                                seller: saleRequest.seller,
                                sellerConfirmed: saleRequest.sellerConfirmed,
                                buyerConfirmed: saleRequest.buyerConfirmed,
                                registrarApproved: saleRequest.registrarApproved
                            }
                        };
                    }
                    return null;
                } catch (error) {
                    // Ignore errors for non-existent lands
                    return null;
                }
            });

            const [ownedLands, allLands] = await Promise.all([
                Promise.all(ownedLandsPromises),
                Promise.all(allLandsPromises)
            ]);

            const validOwnedLands = ownedLands.filter(land => land !== null);
            const pendingPurchases = allLands.filter(land => land !== null);

            setLands(validOwnedLands);
            setPendingSales([
                ...validOwnedLands.filter(land => land.saleStatus.inProgress),
                ...pendingPurchases
            ]);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, 1000); // 1 second debounce

    useEffect(() => {
        if (contract && walletAddress) {
            debouncedFetch();

            const eventNames = [
                'LandRegistered',
                'SaleRequested',
                'SaleConfirmedBySeller',
                'SaleConfirmedByBuyer',
                'SaleApprovedByRegistrar'
            ];

            const listeners = eventNames.map(eventName => {
                try {
                    const filter = contract.filters[eventName]();
                    const listener = (...args) => {
                        console.log(`${eventName} event detected`);
                        debouncedFetch();
                    };
                    contract.on(filter, listener);
                    return { filter, listener };
                } catch (error) {
                    console.warn(`Error setting up ${eventName} listener:`, error);
                    return null;
                }
            }).filter(Boolean);

            return () => {
                debouncedFetch.cancel();
                listeners.forEach(({ filter, listener }) => {
                    try {
                        contract.off(filter, listener);
                    } catch (error) {
                        console.warn("Error removing listener:", error);
                    }
                });
            };
        }
    }, [contract, walletAddress]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInitiateSale = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const tx = await contract.initiateSaleRequest(
                ethers.getBigInt(formData.thandaperNumber),
                formData.buyer
            );
            await tx.wait();
            setFormData({ thandaperNumber: '', buyer: '' });
            setShowSaleForm(false);
            debouncedFetch();
        } catch (error) {
            console.error("Sale initiation error:", error);
            setError(error.message);
            alert(`Failed to initiate sale: ${error.message}`);
        }
    };

    const handleConfirmSale = async (thandaperNumber) => {
        setError(null);
        try {
            const tx = await contract.confirmSaleBySeller(thandaperNumber);
            await tx.wait();
            debouncedFetch();
        } catch (error) {
            console.error("Sale confirmation error:", error);
            setError(error.message);
        }
    };
    // Add this function before the return statement
const getSaleStatus = (sale) => {
    if (!sale || !sale.saleStatus) {
        return "Unknown Status";
    }

    const status = sale.saleStatus;

    if (status.registrarApproved) {
        return "Approved";
    }
    if (status.buyerConfirmed && status.sellerConfirmed) {
        return "Waiting for Registrar";
    }
    if (status.sellerConfirmed && !status.buyerConfirmed) {
        return "Waiting for Buyer";
    }
    if (!status.sellerConfirmed) {
        return "Waiting for Seller";
    }

    return "Pending";
};

    const handleConfirmByBuyer = async (thandaperNumber) => {
        setError(null);
        try {
            const tx = await contract.confirmSaleByBuyer(thandaperNumber);
            await tx.wait();
            debouncedFetch();
        } catch (error) {
            console.error("Purchase confirmation error:", error);
            setError(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.headerTitle}>My Land Portfolio</h1>
                <p style={styles.headerSubtitle}>Manage your land properties and transactions</p>
            </div>

            <div style={styles.buttonSection}>
                <button
                    onClick={() => setShowSaleForm(!showSaleForm)}
                    style={{...styles.button, ...styles.greenButton}}
                >
                    {showSaleForm ? 'Close Sale Form' : 'Initiate Land Sale'}
                </button>
            </div>

            {showSaleForm && (
                <div style={styles.form}>
                    <h2 style={styles.formTitle}>Initiate Land Sale</h2>
                    <form onSubmit={handleInitiateSale}>
                        <div style={styles.formGrid}>
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
                                name="buyer"
                                value={formData.buyer}
                                onChange={handleInputChange}
                                placeholder="Buyer Address"
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={{marginTop: '1rem'}}>
                            <button 
                                type="submit" 
                                style={{...styles.button, ...styles.greenButton}}
                            >
                                Initiate Sale
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* My Properties Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>My Properties</h2>
                {loading ? (
                    <div style={styles.loadingText}>Loading properties...</div>
                ) : lands.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Thandaper Number</th>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Survey Number</th>
                                <th style={styles.th}>Area</th>
                                <th style={styles.th}>Village</th>
                                <th style={styles.th}>Taluk</th>
                                <th style={styles.th}>Market Value</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lands.map((land) => (
                                <tr key={land.thandaperNumber}>
                                    <td style={styles.td}>{land.thandaperNumber}</td>
                                    <td style={styles.td}>{land.landTitle}</td>
                                    <td style={styles.td}>{land.surveyNumber}</td>
                                    <td style={styles.td}>{ethers.formatEther(land.area)} sq ft</td>
                                    <td style={styles.td}>{land.village}</td>
                                    <td style={styles.td}>{land.taluk}</td>
                                    <td style={styles.td}>{ethers.formatEther(land.marketValue)}</td>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    thandaperNumber: land.thandaperNumber
                                                }));
                                                setShowSaleForm(true);
                                            }}
                                            style={{...styles.button, ...styles.blueButton}}
                                        >
                                            Sell
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.emptyText}>No properties found</div>
                )}
            </div>

            {/* Pending Sales Section */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Pending Sales</h2>
                {pendingSales.length > 0 ? (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Land ID</th>
                                <th style={styles.th}>Buyer</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingSales.map((sale) => (
                                <tr key={sale.thandaperNumber}>
                                    <td style={styles.td}>{sale.thandaperNumber}</td>
                                    <td style={styles.td}>
                                        {sale.saleStatus && sale.saleStatus.buyer ? 
                                            `${sale.saleStatus.buyer.slice(0, 6)}...${sale.saleStatus.buyer.slice(-4)}` 
                                            : 'N/A'}
                                    </td>
                                    <td style={styles.td}>
                                        {getSaleStatus(sale)}
                                    </td>
                                    <td style={styles.td}>
                                        {!sale.saleStatus.sellerConfirmed && (
                                            <button
                                                onClick={() => handleConfirmSale(sale.thandaperNumber)}
                                                style={{...styles.button, ...styles.greenButton}}
                                            >
                                                Confirm Sale
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.emptyText}>No pending sales</div>
                )}
            </div>
            {/* Pending Purchases Section */}
{pendingSales.filter(sale => sale.saleStatus.buyer.toLowerCase() === walletAddress.toLowerCase()).length > 0 && (
    <div style={styles.section}>
        <h2>Pending Purchases</h2>
        {pendingSales
            .filter(sale => sale.saleStatus.buyer.toLowerCase() === walletAddress.toLowerCase())
            .map(sale => (
                <div key={sale.thandaperNumber} style={styles.saleCard}>
                    <h3>Land: {sale.landTitle}</h3>
                    <p>Thandaper Number: {sale.thandaperNumber}</p>
                    <p>Seller: {sale.saleStatus.seller}</p>
                    <p>Status: {
                        sale.saleStatus.registrarApproved ? "Approved" :
                        sale.saleStatus.buyerConfirmed ? "Waiting for Registrar" :
                        sale.saleStatus.sellerConfirmed ? "Waiting for Your Confirmation" :
                        "Waiting for Seller Confirmation"
                    }</p>
                    
                    {!sale.saleStatus.buyerConfirmed && sale.saleStatus.sellerConfirmed && (
                        <button 
                            onClick={() => handleConfirmByBuyer(sale.thandaperNumber)}
                            style={styles.confirmButton}
                        >
                            Confirm Purchase
                        </button>
                    )}
                </div>
            ))
        }
    </div>
)}
        </div>
    );
};

export default LandOwnerDashboard;