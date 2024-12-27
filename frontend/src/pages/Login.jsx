import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mock API request for authentication
      const response = await axios.post('/api/login', { username, password });

      const { role } = response.data;

      // Redirect to the respective dashboard based on the role
      if (role === 'admin') navigate('/admin-dashboard');
      else if (role === 'landowner') navigate('/landowner-dashboard');
      else if (role === 'inspector') navigate('/inspector-dashboard');
      else setError('Invalid role');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Land Revenue Management Login</h1>
      <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
