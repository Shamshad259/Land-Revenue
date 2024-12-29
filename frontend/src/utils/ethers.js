import { ethers } from 'ethers';
import LandRevenueABI from '../constants/LandRevenueABI.json';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export const getContract = async () => {
  if (!window.ethereum) throw new Error('MetaMask is not installed');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, LandRevenueABI, signer);
  return contract;
};
