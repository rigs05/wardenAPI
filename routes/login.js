const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const { User } = require('../db/credentials');

// Login
router.post('/', async (req, res) => {
    try {
        const { num } = req.body;
        const existingUser = await User.findOne({ num });
        if (!existingUser) {
            res.send("User does not exists in Database.");
            // console.log("User information not available in DB.");
        } else {
            const uniqueId = uuid.v1();
            await User.updateOne({ id: null }, { $set: {id:uniqueId} });
            await User.findOne({ num })
            .then((data) => {
                res.status(200).json({ message: "Data found in DB.", data: data });
            }).catch((err) => {
                res.json(err);
            })
        }
    }
    catch(err) {
        console.log(err);
        res.status(404).json({ message:"there's an error, couldn't move forward." });
    }
})

module.exports = router;