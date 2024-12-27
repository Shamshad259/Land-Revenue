// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { ChakraProvider } from '@chakra-ui/react';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './components/PrivateRoute';
import Register from './components/auth/Register';
// import Login from './components/auth/Login';
// import Dashboard from './pages/Dashboard';
// import LandRegistry from './pages/LandRegistry';

function App() {
    return (
        // <ChakraProvider>
            <Web3Provider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/register" element={<Register />} />
                            {/* <Route path="/login" element={<Login />} /> */}
                            {/* <Route 
                                path="/dashboard" 
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                } 
                            />
                            <Route 
                                path="/land-registry" 
                                element={
                                    <PrivateRoute>
                                        <LandRegistry />
                                    </PrivateRoute>
                                } 
                            /> */}
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </Web3Provider>
    );
    {/* </ChakraProvider> */}
}

export default App;