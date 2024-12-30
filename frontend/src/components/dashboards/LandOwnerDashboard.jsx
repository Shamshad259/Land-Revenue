import { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import axios from 'axios';

const LandOwnerDashboard = () => {
    // Land type enum to match smart contract
    const LandTypes = {
        'Agricultural': 0,
        'Forest': 1,
        'Urban': 2,
        'Rural': 3,
        'Coastal': 4,
        'Wetland': 5,
        'Government': 6
    };

    const { contract, walletAddress } = useWallet();
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showSaleForm, setShowSaleForm] = useState(false);
    const [formData, setFormData] = useState({
        thandaperNumber: '',
        owner: walletAddress,
        taluk: '',
        village: '',
        surveyNumber: '',
        area: '',
        landType: 'Agricultural',
        landTitle: '',
        protectedStatus: false,
        geoLocation: '',
        marketValue: '',
        buyer: ''
    });

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const response = await axios.get(`/api/land/owned-lands/${walletAddress}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const landIds = response.data.data;
                const landPromises = landIds.map(id => axios.get(`/api/land/details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }));
                const landsData = await Promise.all(landPromises);
                setLands(landsData.map(res => res.data.data));
            } catch (error) {
                console.error("Error fetching lands:", error);
            } finally {
                setLoading(false);
            }
        };

        if (contract && walletAddress) {
            fetchLands();
        }
    }, [contract, walletAddress]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateNumericInput = (value, fieldName) => {
        if (value.trim() === '') {
            throw new Error(`${fieldName} cannot be empty`);
        }
        if (isNaN(value) || Number(value) < 0) {
            throw new Error(`${fieldName} must be a valid positive number`);
        }
    };

    const handleRegisterLand = async (e) => {
        e.preventDefault();
        try {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            // Validate all numeric inputs
            validateNumericInput(formData.thandaperNumber, 'Thandaper Number');
            validateNumericInput(formData.surveyNumber, 'Survey Number');
            validateNumericInput(formData.area, 'Area');
            validateNumericInput(formData.marketValue, 'Market Value');

            // Convert string values to the appropriate types
            const processedData = {
                thandaperNumber: ethers.getBigInt(formData.thandaperNumber), // uint256
                owner: formData.owner, // address
                taluk: formData.taluk, // string
                village: formData.village, // string
                surveyNumber: ethers.getBigInt(formData.surveyNumber), // uint256
                area: ethers.parseUnits(formData.area, 'ether'), // uint256
                landType: LandTypes[formData.landType], // enum as number
                landTitle: formData.landTitle, // string
                protectedStatus: Boolean(formData.protectedStatus), // bool
                geoLocation: formData.geoLocation, // string
                marketValue: ethers.parseUnits(formData.marketValue, 'ether') // uint256
            };

            console.log("Sending data to contract:", processedData);

            const tx = await contract.registerLand(
                processedData.thandaperNumber,
                processedData.owner,
                processedData.taluk,
                processedData.village,
                processedData.surveyNumber,
                processedData.area,
                processedData.landType,
                processedData.landTitle,
                processedData.protectedStatus,
                processedData.geoLocation,
                processedData.marketValue
            );

            const receipt = await tx.wait();

            // Send the transaction hash to the backend
            const response = await axios.post('http://localhost:5000/api/land/register', {
                transactionHash: receipt.hash,
                landData: formData
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log("Land registered successfully:", response.data);
            
            // Reset form
            setFormData({
                thandaperNumber: '',
                owner: walletAddress,
                taluk: '',
                village: '',
                surveyNumber: '',
                area: '',
                landType: 'Agricultural',
                landTitle: '',
                protectedStatus: false,
                geoLocation: '',
                marketValue: '',
                buyer: ''
            });
            setShowRegisterForm(false);
            // Refresh lands list
            fetchLands();
        } catch (error) {
            console.error("Error registering land:", error);
            // You might want to show this error to the user in your UI
        }
    };

    const handleInitiateSale = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/land/sale/initiate', {
                thandaperNumber: formData.thandaperNumber,
                buyer: formData.buyer
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            // Handle successful sale initiation
        } catch (error) {
            console.error("Error initiating sale:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Land Portfolio</h1>
                <p className="text-gray-600 mt-2">Manage your land properties and transactions</p>
            </div>

            <div className="mb-4">
                <button
                    onClick={() => setShowRegisterForm(!showRegisterForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    {showRegisterForm ? 'Close Register Form' : 'Register New Land'}
                </button>
                <button
                    onClick={() => setShowSaleForm(!showSaleForm)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ml-4"
                >
                    {showSaleForm ? 'Close Sale Form' : 'Initiate Land Sale'}
                </button>
            </div>

            {showRegisterForm && (
                <form onSubmit={handleRegisterLand} className="mb-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Register New Land</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="number"
                            name="thandaperNumber"
                            value={formData.thandaperNumber}
                            onChange={handleInputChange}
                            placeholder="Thandaper Number"
                            className="input-field"
                            min="0"
                            required
                        />
                        <input
                            type="text"
                            name="taluk"
                            value={formData.taluk}
                            onChange={handleInputChange}
                            placeholder="Taluk"
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            name="village"
                            value={formData.village}
                            onChange={handleInputChange}
                            placeholder="Village"
                            className="input-field"
                            required
                        />
                        <input
                            type="number"
                            name="surveyNumber"
                            value={formData.surveyNumber}
                            onChange={handleInputChange}
                            placeholder="Survey Number"
                            className="input-field"
                            min="0"
                            required
                        />
                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            placeholder="Area (in square meters)"
                            className="input-field"
                            min="0"
                            step="0.000000000000000001"
                            required
                        />
                        <select
                            name="landType"
                            value={formData.landType}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                        >
                            {Object.keys(LandTypes).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="landTitle"
                            value={formData.landTitle}
                            onChange={handleInputChange}
                            placeholder="Land Title"
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            name="geoLocation"
                            value={formData.geoLocation}
                            onChange={handleInputChange}
                            placeholder="Geo Location"
                            className="input-field"
                            required
                        />
                        <input
                            type="number"
                            name="marketValue"
                            value={formData.marketValue}
                            onChange={handleInputChange}
                            placeholder="Market Value (in ETH)"
                            className="input-field"
                            min="0"
                            step="0.000000000000000001"
                            required
                        />
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="protectedStatus"
                                checked={formData.protectedStatus}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label>Protected Status</label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Register Land
                        </button>
                    </div>
                </form>
            )}

            {showSaleForm && (
                <form onSubmit={handleInitiateSale} className="mb-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Initiate Land Sale</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="thandaperNumber"
                            value={formData.thandaperNumber}
                            onChange={handleInputChange}
                            placeholder="Thandaper Number"
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            name="buyer"
                            value={formData.buyer}
                            onChange={handleInputChange}
                            placeholder="Buyer Address"
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            Initiate Sale
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Properties</h2>
                {loading ? (
                    <div>Loading properties...</div>
                ) : lands.length > 0 ? (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Title</th>
                                <th className="py-2">Survey Number</th>
                                <th className="py-2">Area</th>
                                <th className="py-2">Village</th>
                                <th className="py-2">Taluk</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lands.map((land, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2">{land.landTitle}</td>
                                    <td className="py-2">{land.surveyNumber.toString()}</td>
                                    <td className="py-2">{land.area.toString()} sq ft</td>
                                    <td className="py-2">{land.village}</td>
                                    <td className="py-2">{land.taluk}</td>
                                    <td className="py-2">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-gray-500">No properties found</div>
                )}
            </div>
        </div>
    );
};

export default LandOwnerDashboard;
