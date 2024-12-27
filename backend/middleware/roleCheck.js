// middleware/roleCheck.js
import dotenv from 'dotenv';
dotenv.config();
import { contract } from "../config/web3.js";

// Enum matching the contract
const Roles = {
    None: 0,
    ChiefSecretary: 1,
    Collector: 2,
    Tahsildar: 3,
    VillageOfficer: 4,
    SubRegistrar: 5,
    SeniorRegistrar: 6,
    LandOwner: 7
};

// Function to method role mapping based on your contract
const methodRoles = {
    registerLand: ["SubRegistrar"],
    initiateSaleRequest: ["LandOwner"],
    confirmSaleBySeller: ["LandOwner"],
    confirmSaleByBuyer: ["LandOwner"],
    verifySaleByRegistrar: ["SubRegistrar"],
    approveSaleBySeniorRegistrar: ["SeniorRegistrar"],
    initiateDeathTransfer: ["SubRegistrar"],
    approveDeathTransferByBeneficiary: ["LandOwner"],
    approveDeathTransferByAnonymousRegistrar: ["SubRegistrar"],
    finalizeDeathTransfer: ["SeniorRegistrar"],
    requestProtectedLandTypeChange: ["Tahsildar"],
    approveProtectedLandTypeChange: ["Collector"],
    finalizeProtectedLandTypeChange: ["ChiefSecretary"],
    requestNonProtectedLandTypeChange: ["LandOwner"],
    approveNonProtectedLandTypeChange: ["VillageOfficer"]
};

const roleCheck = async (req, res, next) => {
    try {
        const userAddress = req.user.walletAddress;
        const methodName = req.body.methodName || req.params.methodName;

        if (!methodName) {
            return res.status(400).json({
                error: "Method name not provided"
            });
        }

        // Get required roles for the method
        const requiredRoles = methodRoles[methodName];
        if (!requiredRoles) {
            return res.status(400).json({
                error: "Unknown method or no role requirements"
            });
        }

        // Get user's role from contract
        const userRole = await contract.userRoles(userAddress);
        const userRoleNumber = userRole.toNumber();

        // Check if user has required role
        const hasRequiredRole = requiredRoles.some(role => 
            Roles[role] === userRoleNumber
        );

        if (!hasRequiredRole) {
            return res.status(403).json({
                error: `Access denied. Required role: ${requiredRoles.join(' or ')}`
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default roleCheck;