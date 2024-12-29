// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";  // Remove BrowserRouter
import { WalletProvider } from './context/WalletContext';
import AuthWrapper from './utils/AuthWrapper';  // Updated path
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedComponent from "./components/ProtectedComponent";

function App() {
    return (
        <WalletProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/protected" 
                    element={
                        <AuthWrapper>
                            <ProtectedComponent />
                        </AuthWrapper>
                    } 
                />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </WalletProvider>
    );
}

export default App;