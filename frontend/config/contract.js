import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contractArtifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../artifacts/contracts/LandManagement.sol/LandManagement.json'), 'utf8')
);

export const abi = contractArtifact.abi;
export const bytecode = contractArtifact.bytecode;
