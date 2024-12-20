async function main() {
  // Get the contract factory
  const LandManagement = await ethers.getContractFactory("LandManagement");

  // Deploy the contract
  const landManagement = await LandManagement.deploy();

  // Wait for deployment to complete
  await landManagement.deploymentTransaction();

  // Log the deployed contract address
  console.log("LandManagement deployed to:", landManagement.target);
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
