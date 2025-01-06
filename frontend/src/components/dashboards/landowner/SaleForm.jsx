import { useState } from 'react';
import '../../../styles/dashboard.css';

const SaleForm = ({ formData, handleInputChange, handleInitiateSale }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            await handleInitiateSale(formData);
            setSuccess('Sale initiated successfully!');
        } catch (err) {
            let errorMessage = "Sale initiation failed: ";
            
            if (err.reason) {
                errorMessage += err.reason;
            } else if (err.message && err.message.includes('reason=')) {
                const match = err.message.match(/reason="([^"]+)"/);
                errorMessage += match ? match[1] : err.message;
            } else {
                errorMessage += err.message || "Unknown error occurred";
            }
            
            setError(errorMessage);
            setSuccess('');
        }
    };

    return (
        <div className="dashboard-form-card">
            <h2 className="form-title">Initiate Land Sale</h2>
            
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
                    name="buyer"
                    value={formData.buyer}
                    onChange={handleInputChange}
                    placeholder="Buyer Address"
                    className="dashboard-input"
                    required
                />
                <button type="submit" className="dashboard-button submit-button">
                    Initiate Sale
                </button>
            </form>
        </div>
    );
};

export default SaleForm;
