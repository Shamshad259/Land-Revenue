const { ethers } = require("hardhat");

async function main() {
  try {
    // Get deployer's address
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Get the contract factory
    const LandManagement = await ethers.getContractFactory("LandManagement");
    console.log("Deploying LandManagement...");

    // Deploy the contract
    const landManagement = await LandManagement.deploy();

    // Wait for deployment to complete
    await landManagement.waitForDeployment();
    const deployedAddress = await landManagement.getAddress();

    // Log deployment details
    console.log("LandManagement deployed to:", deployedAddress);
    
    // Verify deployment
    const deployedCode = await ethers.provider.getCode(deployedAddress);
    if (deployedCode === "0x") {
        throw new Error("Contract deployment failed - no code at address");
    }

    // Save deployment info
    const deploymentInfo = {
        contractAddress: deployedAddress,
        deploymentTime: new Date().toISOString(),
        deployer: deployer.address,
        networkInfo: await ethers.provider.getNetwork(),
    };

    console.log("\nDeployment Information:");
    console.log("------------------------");
    console.log("Contract Address:", deploymentInfo.contractAddress);
    console.log("Deployment Time:", deploymentInfo.deploymentTime);
    console.log("Deployer:", deploymentInfo.deployer);
    console.log("Network:", deploymentInfo.networkInfo.name);
    console.log("Chain ID:", deploymentInfo.networkInfo.chainId);

    // Verify initial state
    console.log("\nVerifying initial contract state...");
    
    // Check if deployer is ChiefSecretary
    const deployerRole = await landManagement.userRoles(deployer.address);
    console.log("Deployer Role:", deployerRole.toString());
    
    if (deployerRole.toString() !== "1") { // 1 is ChiefSecretary
        console.warn("Warning: Deployer is not set as ChiefSecretary!");
    } else {
        console.log("✅ Deployer correctly set as ChiefSecretary");
    }

    // Save deployment address to .env if needed
    console.log("\nTo use this contract address in other scripts, add this to your .env file:");
    console.log(`CONTRACT_ADDRESS=${deployedAddress}`);

    return deploymentInfo;

  } catch (error) {
    console.error("\nDeployment failed!");
    console.error("Error details:", error);
    throw error;
  }
}

// Run the deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = main;