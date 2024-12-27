import jwt from 'jsonwebtoken';
import {contract} from '../config/web3.js';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('Auth middleware');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists and is verified in the contract
        const userIdentity = await contract.userIdentities(decoded.walletAddress);
        if (!userIdentity.isVerified) {
            throw new Error('User not verified');
        }
        if (userIdentity.isBlocked) {
            throw new Error('User is blocked');
        }

        req.user = {
            ...decoded,
            govId: userIdentity.governmentId
        };
        next();
    } catch (e) {
        res.status(401).send({ error: e.message || 'Please authenticate' });
    }
}

export default auth;