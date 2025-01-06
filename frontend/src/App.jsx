// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { WalletProvider } from './context/WalletContext';
import Layout from './components/Layout';
import AuthWrapper from './utils/AuthWrapper';
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import './styles/dashboard.css';

function App() {
  return (
    <WalletProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </WalletProvider>
  );
}

export default App;