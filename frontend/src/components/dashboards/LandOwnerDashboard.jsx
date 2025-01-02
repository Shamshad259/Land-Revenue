import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { debounce } from 'lodash';


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
        color: '#4b5563',
        marginTop: '0.5rem'
    },
    buttonSection: {
        marginBottom: '1rem'
    },
    button: {
        base: {
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        },
        green: {
            backgroundColor: '#22c55e',
            color: 'white',
            '&:hover': {
                backgroundColor: '#16a34a'
            }
        },
        blue: {
            backgroundColor: '#3b82f6',
            color: 'white',
            marginRight: '0.5rem',
            '&:hover': {
                backgroundColor: '#2563eb'
            }
        },
        gray: {
            backgroundColor: '#6b7280',
            color: 'white',
            '&:hover': {
                backgroundColor: '#4b5563'
            }
        }
    },
    form: {
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    formTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem'
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem'
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        '&:focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
        }
    },
    section: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem'
    },
    table: {
        width: '100%',
        backgroundColor: 'white',
        borderCollapse: 'collapse'
    },
    th: {
        padding: '0.5rem',
        textAlign: 'left',
        borderBottom: '1px solid #e5e7eb'
    },
    td: {
        padding: '0.5rem',
        textAlign: 'left',
        borderBottom: '1px solid #e5e7eb'
    },
    emptyText: {
        color: '#6b7280'
    },
    loadingText: {
        color: '#6b7280',
        textAlign: 'center',
        padding: '1rem'
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
                ethers.BigNumber.from(formData.thandaperNumber),
                formData.buyer
            );
            await tx.wait();
            setFormData({ thandaperNumber: '', buyer: '' });
            setShowSaleForm(false);
            debouncedFetch();
        } catch (error) {
            console.error("Sale initiation error:", error);
            setError(error.message);
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
                    style={{...styles.button.base, ...styles.button.green}}
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
                                style={{...styles.button.base, ...styles.button.green}}
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
                                <th style={styles.th}>Market Value (ETH)</th>
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
                                            style={{...styles.button.base, ...styles.button.blue}}
                                        >
                                            Sell
                                        </button>
                                        <button 
                                            style={{...styles.button.base, ...styles.button.gray}}
                                        >
                                            Details
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
                                        {`${sale?.buyer?.slice(0, 6)}...${sale?.buyer?.slice(-4)}`}
                                    </td>
                                    <td style={styles.td}>
                                        {getSaleStatus(sale)}
                                    </td>
                                    <td style={styles.td}>
                                        {!sale.sellerConfirmed && (
                                            <button
                                                onClick={() => handleConfirmSale(sale.thandaperNumber)}
                                                style={{...styles.button.base, ...styles.button.green}}
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