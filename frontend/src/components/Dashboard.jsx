import { useWallet } from '../context/WalletContext';
import LandOwnerDashboard from './dashboards/LandOwnerDashboard';
import OfficialDashboard from './dashboards/OfficialDashboard';

const Dashboard = () => {
    const { userRole } = useWallet();

    if (userRole === 'LandOwner') {
        return <LandOwnerDashboard />;
    }

    return <OfficialDashboard />;
};

export default Dashboard;
