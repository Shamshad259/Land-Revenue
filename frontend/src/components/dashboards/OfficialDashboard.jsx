import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';

const OfficialDashboard = () => {
    const { userRole, contract } = useWallet();
    const [pendingActions, setPendingActions] = useState([]);
    const [loading, setLoading] = useState(true);

    const roleActions = {
        ChiefSecretary: [
            { name: "Approve Land Type Changes", action: "landType" },
            { name: "View System Statistics", action: "stats" },
            { name: "Manage Officials", action: "officials" }
        ],
        Collector: [
            { name: "Review Land Type Changes", action: "review" },
            { name: "Manage District Records", action: "records" }
        ],
        SubRegistrar: [
            { name: "Process Land Transfers", action: "transfers" },
            { name: "Verify Documents", action: "verify" }
        ],
        // Add actions for other roles...
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {userRole} Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage land revenue operations and approvals
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Role Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Actions</h2>
                    <div className="space-y-3">
                        {roleActions[userRole]?.map((action, index) => (
                            <button
                                key={index}
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                            >
                                {action.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {/* Pending items will go here */}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {/* Activity items will go here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialDashboard;
