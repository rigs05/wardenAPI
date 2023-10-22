const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    num: {
        type: Number,
        required: true,
        unique: true,
        maxlength: 10,
    },
    pass: {
        type: String,
        required: true,
        maxlength: 25,
    },
    id: {
        type: String,
        unique: false,
        default: null,
    }
});
const User = model('users', userSchema);

module.exports = { User };