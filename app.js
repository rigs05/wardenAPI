const express = require('express');
const app = express();
const register = require("./routes/register");
const login = require("./routes/login");
const public = require('./routes/public');
const { dbconnection } = require('./db/db');

async function startServer() {
    try {
        //Establishing Database connection
        await dbconnection();
        console.log("Connected to DB successfully.");

        app.use(express.urlencoded({ extended: false }));
        app.use(express.json());
        
        app.use('/register', register);
        app.use('/login', login);
        app.use('/api', public);
        
        // Server connection
        app.listen(5000, (req, res) => {
            console.log("Server connected with port 5000.");
        })
    }
    catch(err) {
        console.log(err);
    }
}
startServer();


/////////////////////////////////////////////////////////////////////////////////////

// Connecting to MongoDB
// const connection = () => {
//     mongoose.connect(
//         'mongodb://127.0.0.1:27017/wardenDB',
//         { useNewUrlParser: true, useUnifiedTopology: true }
//     ).then (() => {
//             console.log('Database connected successfully');
//     }).catch ((err) => {
//             console.log(err);
//     });
// }

// connection();
    