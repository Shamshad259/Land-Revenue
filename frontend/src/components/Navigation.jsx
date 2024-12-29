import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navigation = () => {
    const navigate = useNavigate();
    const { walletAddress } = useWallet();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('walletAddress');
        navigate('/login');
    };

    return (
        <nav className="p-4 bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    {!walletAddress ? (
                        <>
                            <button onClick={() => navigate('/login')}>Login</button>
                            <button onClick={() => navigate('/register')}>Register</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/protected')}>Protected Page</button>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
                {walletAddress && (
                    <div className="text-sm truncate">
                        Connected: {walletAddress}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;