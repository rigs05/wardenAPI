const express = require('express');
const router = express.Router();
const { User } = require('../db/credentials');

// Register
router.post('/', async (req, res) => {
    try {
        const { name, num, pass } = req.body;
        const existingUser = await User.findOne({ num });
        if (existingUser) {
            return res.status(400).json({message: "the user already exists in the database."})
        }
        const newUser = new User({ name, num, pass });
        newUser.save();
        res.status(200).json({ message: "Data inserted successfully", data: newUser });

    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message:"there's an error, couldn't move forward." });
    }
})

module.exports = router;