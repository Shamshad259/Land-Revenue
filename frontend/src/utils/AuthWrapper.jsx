import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const AuthWrapper = ({ children }) => {
    const { walletAddress } = useWallet();
    const token = localStorage.getItem('token');
    const location = useLocation();

    // Check both wallet connection and token
    if (!walletAddress || !token) {
        // Save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthWrapper;