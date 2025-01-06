import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import { debounce } from 'lodash';
import { landownerDashboardStyles } from '../../styles/components/landowner-dashboard';
import SaleForm from './landowner/SaleForm';
import PropertiesList from './landowner/PropertiesList';
import PendingSales from './landowner/PendingSales';
import PendingPurchases from './landowner/PendingPurchases';

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

    const debouncedFetch = debounce(async () => {
        try {
            if (!contract || !walletAddress) {
                setError("Wallet not connected");
                return;
            }

            setLoading(true);
            setError(null);

            const ownedLandIds = await contract.getOwnedLands(walletAddress);
            
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
            const maxLandId = 100; 
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
    }, 1000);
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

    const handleInitiateSale = async (formData) => {
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
            throw error; 
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
        <div style={landownerDashboardStyles.container}>
            <div style={landownerDashboardStyles.header}>
                <h1 style={landownerDashboardStyles.headerTitle}>My Land Portfolio</h1>
                <p style={landownerDashboardStyles.headerSubtitle}>
                    Manage your land properties and transactions
                </p>
            </div>

            <div style={landownerDashboardStyles.buttonSection}>
                <button
                    onClick={() => setShowSaleForm(!showSaleForm)}
                    style={{...landownerDashboardStyles.button, ...landownerDashboardStyles.greenButton}}
                >
                    {showSaleForm ? 'Close Sale Form' : 'Initiate Land Sale'}
                </button>
            </div>

            {showSaleForm && (
                <SaleForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleInitiateSale={handleInitiateSale}
                />
            )}

            <div style={landownerDashboardStyles.section}>
                <h2 style={landownerDashboardStyles.sectionTitle}>My Properties</h2>
                <PropertiesList 
                    lands={lands}
                    loading={loading}
                    handleSell={(thandaperNumber) => {
                        setFormData(prev => ({ ...prev, thandaperNumber }));
                        setShowSaleForm(true);
                    }}
                />
            </div>

            <div style={landownerDashboardStyles.section}>
                <h2 style={landownerDashboardStyles.sectionTitle}>Pending Sales</h2>
                <PendingSales 
                    sales={pendingSales}
                    handleConfirmSale={handleConfirmSale}
                    getSaleStatus={getSaleStatus}
                />
            </div>

            <PendingPurchases 
                sales={pendingSales}
                walletAddress={walletAddress}
                handleConfirmByBuyer={handleConfirmByBuyer}
            />
        </div>
    );
};

export default LandOwnerDashboard;