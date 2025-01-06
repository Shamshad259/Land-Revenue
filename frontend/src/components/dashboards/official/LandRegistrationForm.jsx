import { useState } from 'react';
import '../../../styles/dashboard.css';

const LandRegistrationForm = ({ formData, handleInputChange, handleRegisterLand }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            const result = await handleRegisterLand(formData);
            if (!result) {
                throw new Error("Registration failed");
            }
            setSuccess('Land registered successfully!');
        } catch (err) {
            console.log("Registration error:", err);
            
            // Extract the error message
            let errorMessage = "Registration failed: ";
            
            if (err.reason) {
                // This catches the revert reason from the contract
                errorMessage += err.reason;
            } else if (err.error && err.error.data && err.error.data.message) {
                // This catches detailed error data
                errorMessage += err.error.data.message;
            } else if (err.data && err.data.message) {
                // Another format of error data
                errorMessage += err.data.message;
            } else if (typeof err === 'object' && err.message) {
                // Get the message property if it exists
                const match = err.message.match(/reason="([^"]+)"/);
                if (match) {
                    errorMessage += match[1];
                } else {
                    errorMessage += err.message;
                }
            } else {
                // Fallback for any other error format
                errorMessage += String(err);
            }
            
            setError(errorMessage);
            setSuccess(''); // Clear any success message if there's an error
        }
    };

    return (
        <div className="dashboard-form-card">
            <h2 className="form-title">Register New Land</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={onSubmit} className="form-grid">
                <input
                    type="text"
                    name="thandaperNumber"
                    value={formData.thandaperNumber}
                    onChange={handleInputChange}
                    placeholder="Thandaper Number"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    placeholder="Owner Address"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="taluk"
                    value={formData.taluk}
                    onChange={handleInputChange}
                    placeholder="Taluk"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    placeholder="Village"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="surveyNumber"
                    value={formData.surveyNumber}
                    onChange={handleInputChange}
                    placeholder="Survey Number"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Area"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="landTitle"
                    value={formData.landTitle}
                    onChange={handleInputChange}
                    placeholder="Land Title"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="geoLocation"
                    value={formData.geoLocation}
                    onChange={handleInputChange}
                    placeholder="Geo Location"
                    className="dashboard-input"
                    required
                />
                <input
                    type="text"
                    name="marketValue"
                    value={formData.marketValue}
                    onChange={handleInputChange}
                    placeholder="Market Value"
                    className="dashboard-input"
                    required
                />
                <button
                    type="submit"
                    className="dashboard-button submit-button"
                >
                    Register Land
                </button>
            </form>
        </div>
    );
};

export default LandRegistrationForm;
