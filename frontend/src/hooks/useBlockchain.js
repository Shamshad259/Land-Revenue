import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi } from "../../config/contract.js";


const useBlockchain = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const CONTRACT_ABI = abi;
  const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        const signer = ethProvider.getSigner();
        const landContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(landContract);

        console.log("Connected:", accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected. Please install it!");
    }
  };

  return { provider, account, contract, connectWallet };
};

export default useBlockchain;
