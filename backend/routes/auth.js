import express from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { contract } from '../config/web3.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const AUTH_MESSAGE = "Please sign this message to authenticate with the Land Management System";

router.post('/login', async (req, res) => {
    try {
        const { walletAddress, signature } = req.body;
        
        if (!walletAddress || !signature) {
            return res.status(400).json({ error: 'Wallet address and signature are required' });
        }

        try {
            const recoveredAddress = ethers.verifyMessage(AUTH_MESSAGE, signature);
            if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
                return res.status(401).json({ error: 'Invalid signature' });
            }
        } catch (error) {
            console.error('Signature verification error:', error);
            return res.status(401).json({ error: 'Invalid signature' });
        }

        try {
            const userIdentity = await contract.userIdentities(walletAddress);
            
            if (!userIdentity.governmentId) {
                return res.status(401).json({ error: 'User not registered' });
            }

            if (!userIdentity.isVerified) {
                return res.status(401).json({ error: 'User not verified' });
            }

            if (userIdentity.isBlocked) {
                return res.status(401).json({ error: 'Account is blocked' });
            }

            // Get user role
            const userRole = await contract.userRoles(walletAddress);

            const token = jwt.sign(
                { 
                    walletAddress: walletAddress.toLowerCase(),
                    govId: userIdentity.governmentId,
                    role: userRole.toString()
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({ 
                success: true,
                data: {
                    token,
                    walletAddress: walletAddress.toLowerCase(),
                    role: userRole.toString(),
                    govId: userIdentity.governmentId
                }
            });
        } catch (error) {
            console.error('Contract interaction error:', error);
            return res.status(500).json({ error: 'Failed to verify user status' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { govId } = req.body;
        
        if (!govId) {
            return res.status(400).json({ 
                success: false, 
                error: "Government ID is required" 
            });
        }

        // Updated address validation for ethers v6
        if (!ethers.isAddress(req.body.walletAddress)) {
            return res.status(400).json({
                success: false,
                error: "Invalid wallet address format"
            });
        }

        const txData = {
            methodName: "registerUser",
            params: [govId],
            to: process.env.CONTRACT_ADDRESS
        };

        res.json({
            success: true,
            data: txData,
            message: "Please sign the transaction to complete registration"
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Registration failed",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;