// src/components/auth/Register.jsx
import { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [govId, setGovId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { account, contract } = useWeb3();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Backend registration
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress: account,
                    govId
                })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            // Blockchain transaction
            const tx = await contract[data.data.methodName](...data.data.params);
            await tx.wait();

            // Auto-login after registration
            const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress: account,
                    signature: await signMessage()
                })
            });

            const loginData = await loginResponse.json();
            if (loginData.success) {
                login(loginData.data, loginData.data.token);
                navigate('/dashboard');
            }

        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={govId}
                    onChange={(e) => setGovId(e.target.value)}
                    placeholder="Government ID"
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;