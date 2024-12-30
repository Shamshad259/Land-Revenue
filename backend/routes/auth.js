import express from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';
import {contract} from '../config/web3.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const AUTH_MESSAGE = "Please sign this message to authenticate with the Land Management System";

router.get('/auth-message', (req, res) => {
    res.json({ message: AUTH_MESSAGE });
});

router.post('/login', async (req, res) => {
    try {
        const { walletAddress, signature } = req.body;
        
        try {
            const recoveredAddress = ethers.utils.verifyMessage(AUTH_MESSAGE, signature);
            
            if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
                return res.status(401).json({ error: 'Invalid signature' });
            }
        } catch (error) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        try {
            const userIdentity = await contract.userIdentities(walletAddress);

            if (!userIdentity.isVerified) {
                return res.status(401).json({ error: 'User not registered' });
            }

            if (userIdentity.isBlocked) {
                return res.status(401).json({ error: 'User is blocked' });
            }

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
                    role: userRole.toString()
                }
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to verify user status' });
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { walletAddress, govId } = req.body;
        
        if (!walletAddress || !govId) {
            return res.status(400).json({ 
                success: false, 
                error: "Wallet address and Government ID are required" 
            });
        }

        if (!ethers.utils.isAddress(walletAddress)) {
            return res.status(400).json({
                success: false,
                error: "Invalid wallet address format"
            });
        }

        try {
            const userIdentity = await contract.userIdentities(walletAddress);
            console.log("User Identity:", userIdentity);
            
            if (userIdentity.isVerified) {
                return res.status(400).json({ 
                    success: false, 
                    error: "User already registered" 
                });
            }
        } catch (contractError) {
            console.error("Contract call error:", contractError);
            return res.status(500).json({
                success: false,
                error: "Failed to check user registration status"
            });
        }

        const txData = {
            methodName: "registerUser",
            params: [govId],
            to: process.env.CONTRACT_ADDRESS,
        };

        res.json({
            success: true,
            data: txData,
            message: "Please sign the transaction to complete registration"
        });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({ 
            success: false, 
            error: "Registration failed",
            details: e.message 
        });
    }
});

router.post("/block", auth, async (req, res) => {
    try {
        const { govId } = req.body;
        const txData = {
            methodName: "blockAccount",
            params: [govId],
            to: contract.address,
        };
        res.json({
            success: true,
            data: txData,
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.post("/unblock", auth, async (req, res) => {
    try {
        const { userAddress } = req.body;
        const txData = {
            methodName: "unblockAccount",
            params: [userAddress],
            to: contract.address,
        };
        res.json({
            success: true,
            data: txData,
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.post("/add-trusted-contact", auth, async (req, res) => {
    try {
        const { contact } = req.body;
        const txData = {
            methodName: "addTrustedContact",
            params: [contact],
            to: contract.address,
        };
        res.json({
            success: true,
            data: txData,
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.post("/initiate-recovery", async (req, res) => {
    try {
        const { govId, newAddress, backupHash } = req.body;
        const txData = {
            methodName: "initiateRecovery",
            params: [govId, newAddress, backupHash],
            to: contract.address,
        };
        res.json({
            success: true,
            data: txData,
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.post("/complete-recovery", auth, async (req, res) => {
    try {
        const { govId, oldAddress, newAddress } = req.body;
        const txData = {
            methodName: "completeRecovery",
            params: [govId, oldAddress, newAddress],
            to: contract.address,
        };
        res.json({
            success: true,
            data: txData,
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.post('/logout', auth, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
});

router.get('/profile', auth, async (req, res) => {
    try {
        const userIdentity = await contract.userIdentities(req.user.walletAddress);
        const userRole = await contract.userRoles(req.user.walletAddress);

        res.json({
            success: true,
            data: {
                walletAddress: req.user.walletAddress,
                govId: userIdentity.governmentId,                isVerified: userIdentity.isVerified,                isBlocked: userIdentity.isBlocked,                role: userRole.toNumber()            }
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

export default router;