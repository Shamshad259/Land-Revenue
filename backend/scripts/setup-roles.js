import { ethers } from 'ethers';
import { contract } from '../config/web3.js';

const PREDEFINED_ROLES = {
    ChiefSecretary: {
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        govId: "CS123456"
    },
    Collector: {
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        govId: "COL123456"
    },
    Tahsildar: {
        address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        govId: "TAH123456"
    },
    VillageOfficer: {
        address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        govId: "VO123456"
    },
    SubRegistrar: {
        address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        govId: "SR123456"
    },
    SeniorRegistrar: {
        address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        govId: "SNR123456"
    }
};

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

async function setupRoles() {
    try {
        console.log("Starting role setup...");

        for (const [role, data] of Object.entries(PREDEFINED_ROLES)) {
            try {
                console.log(`Setting up ${role}...`);

                // Register user first
                const registerTx = await contract.registerUser(data.govId);
                await registerTx.wait();
                console.log(`User registered for ${role}`);

                // Set role
                const roleTx = await contract.setUserRole(data.address, Roles[role]);
                await roleTx.wait();
                console.log(`Role set for ${role}`);

                console.log(`✅ ${role} setup complete`);
            } catch (error) {
                console.error(`Error setting up ${role}:`, error.message);
            }
        }

        console.log("Role setup complete!");
    } catch (error) {
        console.error("Setup failed:", error);
    }
}

setupRoles().then(() => process.exit(0)).catch(console.error);
