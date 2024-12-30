import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navigation = () => {
    const navigate = useNavigate();
    const { walletAddress, userRole } = useWallet();
    
    const handleLogout = () => {
        // Clear all session data
        localStorage.removeItem('token');
        localStorage.removeItem('walletAddress');
        // Reload the page to clear wallet connection
        window.location.reload();
    };

    return (
        <nav className="w-full bg-white shadow-md sticky top-0 z-50">
            <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span onClick={() => navigate('/')} className="cursor-pointer flex items-center">
                            <span className="text-2xl font-bold text-gray-800">
                                Land Revenue
                            </span>
                            <span className="text-sm ml-2 text-gray-500 font-medium">
                                Management System
                            </span>
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {!walletAddress ? (
                            <div className="flex space-x-4">
                                <button onClick={() => navigate('/login')} className="btn-primary">
                                    Login
                                </button>
                                <button onClick={() => navigate('/register')} className="btn-secondary">
                                    Register
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {userRole || 'No Role'}
                                    </span>
                                    <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                        {walletAddress}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="btn-danger">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;