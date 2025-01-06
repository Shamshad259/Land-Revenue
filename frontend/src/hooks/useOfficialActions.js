import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useOfficialActions = (contract, userRole) => {
    const [loading, setLoading] = useState(true);
    const [pendingActions, setPendingActions] = useState({
        sales: [],
        recoveries: []
    });

    const fetchPendingActions = async () => {
        if (!contract) return;

        try {
            setLoading(true);
            
            if (userRole === 'Registrar') {
                const landIds = await contract.getLands();
                const salesPromises = landIds.map(async (landId) => {
                    try {
                        const [sale, landDetails] = await Promise.all([
                            contract.saleRequests(landId),
                            contract.getLandDetails(landId)
                        ]);
                        
                        if (sale && 
                            sale.buyer !== ethers.ZeroAddress && 
                            sale.sellerConfirmed && 
                            sale.buyerConfirmed && 
                            !sale.registrarApproved) {
                            
                            return {
                                thandaperNumber: landId.toString(),
                                seller: sale.seller,
                                buyer: sale.buyer,
                                sellerConfirmed: sale.sellerConfirmed,
                                buyerConfirmed: sale.buyerConfirmed,
                                landTitle: landDetails[5],
                                area: landDetails[4].toString(),
                                village: landDetails[2]
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
            else if (userRole === 'Collector') {
                const activeRecoveryGovIds = await contract.getAllRecoveryRequests();
                
                const pendingRecoveries = await Promise.all(
                    activeRecoveryGovIds.map(async (govId) => {
                        try {
                            const recovery = await contract.getRecoveryRequest(govId);
                            if (recovery && recovery.isActive && !recovery.isProcessed) {
                                return {
                                    govId: govId,
                                    newAddress: recovery.newAddress,
                                    timestamp: recovery.requestTime.toString(),
                                    isActive: recovery.isActive
                                };
                            }
                        } catch (error) {
                            console.error(`Error fetching recovery request for ${govId}:`, error);
                        }
                        return null;
                    })
                );

                const validRecoveries = pendingRecoveries.filter(recovery => recovery !== null);
                setPendingActions(prev => ({
                    ...prev,
                    recoveries: validRecoveries
                }));
            }
        } catch (error) {
            console.error("Error fetching pending actions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (contract && (userRole === 'Registrar' || userRole === 'Collector')) {
            fetchPendingActions();

            // Set up event listeners
            const filters = [
                'SaleRequested',
                'SaleConfirmedBySeller',
                'SaleConfirmedByBuyer',
                'SaleApprovedByRegistrar',
                'RecoveryRequested',
                'RecoveryCompleted',
                'AccountBlocked',
                'AccountUnblocked'
            ].map(eventName => {
                const filter = contract.filters[eventName]();
                contract.on(filter, fetchPendingActions);
                return { eventName, filter };
            });

            return () => {
                filters.forEach(({ eventName, filter }) => {
                    contract.off(filter, fetchPendingActions);
                });
            };
        } else {
            setLoading(false);
        }
    }, [contract, userRole]);

    return { loading, pendingActions, fetchPendingActions };
};
