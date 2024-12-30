const hre = require("hardhat");

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

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Setting up roles with account:", deployer.address);

  // Get the contract
  const LandManagement = await hre.ethers.getContractFactory("LandManagement");
  const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract address
  const contract = await LandManagement.attach(contractAddress);

  // Setup each role
  for (const [roleName, data] of Object.entries(PREDEFINED_ROLES)) {
    try {
      console.log(`Setting up ${roleName}...`);
      
      // First register the user
      console.log(`Registering ${roleName} with govId: ${data.govId}`);
      const tx1 = await contract.connect(await ethers.getImpersonatedSigner(data.address)).registerUser(data.govId);
      await tx1.wait();
      console.log(`Registration transaction completed for ${roleName}`);

      // Then set their role
      console.log(`Setting role for ${roleName}`);
      const tx2 = await contract.setUserRole(data.address, Roles[roleName]);
      await tx2.wait();
      console.log(`Role set successfully for ${roleName}`);

      console.log(`✅ ${roleName} setup complete`);
    } catch (error) {
      console.error(`❌ Error setting up ${roleName}:`, error.message);
      // Continue with next role even if one fails
    }
  }

  console.log("All roles setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
