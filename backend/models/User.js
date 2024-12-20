const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['ChiefSecretary', 'Collector', 'Tahsildar', 'VillageOfficer', 'SubRegistrar', 'SeniorRegistrar', 'LandOwner'],
        default: 'LandOwner',
    },
    isApproved: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('User', userSchema);