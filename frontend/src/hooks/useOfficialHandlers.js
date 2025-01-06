import { useState } from 'react';
import { ethers } from 'ethers';

export const useOfficialHandlers = (contract, userRole, fetchPendingActions) => {
    const [loading, setLoading] = useState(false);

    const handleRegisterLand = async (formData) => {
        try {
            setLoading(true);
            if (!contract) throw new Error("Contract not initialized");
            if (userRole !== 'Registrar') {
                throw new Error("Access denied: Only Registrar can register land");
            }

            const tx = await contract.registerLand(
                ethers.getBigInt(formData.thandaperNumber),
                formData.owner,
                formData.taluk,
                formData.village,
                ethers.getBigInt(formData.surveyNumber),
                ethers.parseUnits(formData.area, 'ether'),
                formData.landTitle,
                formData.geoLocation,
                ethers.parseUnits(formData.marketValue, 'ether')
            );
            
            const receipt = await tx.wait();
            
            if (receipt.status === 1) {
                await fetchPendingActions();
                return true;
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Error registering land:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleApproveSale = async (thandaperNumber) => {
        try {
            setLoading(true);
            const tx = await contract.approveSaleByRegistrar(
                ethers.getBigInt(thandaperNumber)
            );
            await tx.wait();
            await fetchPendingActions();
            return true;
        } catch (error) {
            console.error("Error approving sale:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRecovery = async (govId) => {
        try {
            setLoading(true);
            const tx = await contract.approveRecovery(govId);
            await tx.wait();
            await fetchPendingActions();
            return true;
        } catch (error) {
            console.error("Error approving recovery:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSetUserRole = async (userAddress, role) => {
        try {
            setLoading(true);
            const tx = await contract.setUserRole(userAddress, Number(role));
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error setting user role:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUnblockAccount = async (userAddress) => {
        try {
            setLoading(true);
            const tx = await contract.unblockAccount(userAddress);
            await tx.wait();
            await fetchPendingActions();
            return true;
        } catch (error) {
            console.error("Error unblocking account:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleRegisterLand,
        handleApproveSale,
        handleApproveRecovery,
        handleSetUserRole,
        handleUnblockAccount
    };
};
