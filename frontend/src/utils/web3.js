// src/utils/web3.js
import { ethers } from 'ethers';

export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
    }

    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        return accounts[0];
    } catch (error) {
        throw new Error('Failed to connect wallet: ' + error.message);
    }
};

export const signMessage = async (message) => {
    if (!window.ethereum) throw new Error('Please install MetaMask!');
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return await signer.signMessage(message);
};