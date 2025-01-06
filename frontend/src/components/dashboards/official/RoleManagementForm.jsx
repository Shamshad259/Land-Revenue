import { officialDashboardStyles } from '../../../styles/components/official-dashboard';

const roleOptions = {
    ChiefSecretary: '1',
    Collector: '2',
    Registrar: '3',
    LandOwner: '4'
};

const RoleManagementForm = ({ formData, handleInputChange, handleSetUserRole }) => {
    return (
        <div style={officialDashboardStyles.formCard}>
            <h2 style={officialDashboardStyles.formTitle}>Set User Role</h2>
            <form onSubmit={handleSetUserRole} style={officialDashboardStyles.formGrid}>
                <input
                    type="text"
                    name="userAddress"
                    value={formData.userAddress}
                    onChange={handleInputChange}
                    placeholder="User Address"
                    style={officialDashboardStyles.input}
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={officialDashboardStyles.select}
                    required
                >
                    {Object.entries(roleOptions).map(([role, value]) => (
                        <option key={value} value={value}>
                            {role}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    style={{...officialDashboardStyles.submitButton, gridColumn: 'span 2'}}
                >
                    Set Role
                </button>
            </form>
        </div>
    );
};

export default RoleManagementForm;
