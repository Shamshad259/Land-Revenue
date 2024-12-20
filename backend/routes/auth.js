const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try{
        const {username, password, walletAddress} = req.body;
        const bcryptPassword = await bcrypt.hash(password, 10);
        const user = new User({username, password:bcryptPassword, walletAddress,role:"LandOwner"});
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch(e) {
        res.status(400).send({ error: e.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new Error('Invalid login credentials');
        }

        if (!user.isApproved) {
            throw new Error('Account pending approval');
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, walletAddress: user.walletAddress },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role, walletAddress: user.walletAddress });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;