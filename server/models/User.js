const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('users', UserSchema);