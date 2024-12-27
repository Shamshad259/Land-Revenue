// src/context/Web3Context.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi } from '../../config/contract.js';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    import.meta.env.CONTRACT_ADDRESS,
                    abi,
                    signer
                );

                setProvider(provider);
                setContract(contract);

                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts'
                    });
                    setAccount(accounts[0]);
                } catch (error) {
                    console.error("User denied account access");
                }
            }
            setIsLoading(false);
        };

        init();
    }, []);

    return (
        <Web3Context.Provider value={{ account, contract, provider, isLoading }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);