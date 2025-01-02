// AuthWrapper.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useEffect, useState } from 'react';

const AuthWrapper = ({ children }) => {
    const { walletAddress, connectWallet } = useWallet();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const initWallet = async () => {
            if (!walletAddress) {
                try {
                    await connectWallet();
                } catch (error) {
                    console.error("Failed to connect wallet:", error);
                }
            }
            setIsLoading(false);
        };

        initWallet();
    }, [walletAddress, connectWallet]);

    // Show loading state while checking wallet
    if (isLoading) {
        return <div>Loading...</div>; // Or your loading component
    }

    // Check both wallet connection and token
    if (!walletAddress || !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthWrapper;