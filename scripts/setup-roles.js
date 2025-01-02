const hre = require("hardhat");
const { ethers } = require("hardhat");

const PREDEFINED_ROLES = {
  ChiefSecretary: {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    govId: "CS123456"
  },
  Collector: {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    govId: "COL123456"
  },
  Registrar: {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    govId: "SR123456"
  }
};

const Roles = {
  None: 0,
  ChiefSecretary: 1,
  Collector: 2,
  Registrar: 3,
  LandOwner: 4
};

async function isUserRegistered(contract, address) {
  try {
    const userIdentity = await contract.userIdentities(address);
    return userIdentity.isVerified;
  } catch (error) {
    console.error("Error checking user registration:", error);
    return false;
  }
}

async function getCurrentRole(contract, address) {
  try {
    const role = await contract.userRoles(address);
    return role;
  } catch (error) {
    console.error("Error checking user role:", error);
    return 0;
  }
}

async function main() {
  // Get signers
  const [deployer] = await hre.ethers.getSigners();
  console.log("Setting up roles with deployer account:", deployer.address);

  // Get the contract
  const LandManagement = await ethers.getContractFactory("LandManagement");
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS environment variable is not set");
  }
  
  // Important: Connect the contract with the deployer (Chief Secretary) account
  const contract = (await LandManagement.attach(contractAddress)).connect(deployer);

  // Verify deployer is Chief Secretary
  const deployerRole = await getCurrentRole(contract, deployer.address);
  if (deployerRole != Roles.ChiefSecretary) {
    throw new Error("Deployer is not Chief Secretary. Current role: " + deployerRole);
  }
  console.log("Verified deployer as Chief Secretary");

  // Set up other roles
  for (const [roleName, data] of Object.entries(PREDEFINED_ROLES)) {
    if (roleName === 'ChiefSecretary') continue; // Skip CS as it's already set up
    
    try {
      console.log(`\nProcessing ${roleName}...`);
      
      // Check if user is already registered
      const isRegistered = await isUserRegistered(contract, data.address);
      const currentRole = await getCurrentRole(contract, data.address);
      
      if (!isRegistered) {
        // Register the user
        console.log(`Registering ${roleName} with govId: ${data.govId}`);
        const impersonatedSigner = await ethers.getImpersonatedSigner(data.address);
        
        // Fund the impersonated account if needed
        const balance = await ethers.provider.getBalance(data.address);
        if (balance < ethers.parseEther("0.1")) {
          await deployer.sendTransaction({
            to: data.address,
            value: ethers.parseEther("1.0")
          });
          console.log(`Funded ${roleName} account with 1 ETH`);
        }
        
        const tx1 = await contract.connect(impersonatedSigner).registerUser(data.govId);
        await tx1.wait();
        console.log(`Registration completed for ${roleName}`);
      } else {
        console.log(`${roleName} is already registered`);
      }

      // Set their role if it's not already set correctly
      if (currentRole !== Roles[roleName]) {
        console.log(`Setting role for ${roleName} using Chief Secretary account`);
        // Important: Use the contract instance that's connected to the deployer
        const tx2 = await contract.setUserRole(data.address, Roles[roleName]);
        await tx2.wait();
        console.log(`✅ Role set for ${roleName}`);
      } else {
        console.log(`✅ ${roleName} already has correct role`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${roleName}:`, error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  console.log("\nSetup process complete!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
