const mongoose = require('mongoose');

// Connecting to MongoDB
const dbconnection = async() => {
    await mongoose.connect(
        'mongodb://127.0.0.1:27017/wardenDB',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
}

module.exports = { dbconnection };