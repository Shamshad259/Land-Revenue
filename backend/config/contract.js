const path = require('path');
const contractArtifact = require(path.join(__dirname, '../../artifacts/contracts/LandManagement.sol/LandManagement.json'));

module.exports = {
    abi: contractArtifact.abi,
    bytecode: contractArtifact.bytecode
};