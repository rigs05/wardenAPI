const express = require('express');
const router = express.Router();
const { User } = require('../db/credentials');
const { SlotModel } = require('../db/schedule');
const decodeHeader = require('../controller/decodeHeader');


// Fetching the available slots of a person
router.post('/fetchslots', decodeHeader, async (req, res) => {
    try {
        const { userId, start, end } = req.body;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const availableSlots = [];

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (currentDate.getDay() === 4 || currentDate.getDay() === 5) {
                const startTime = new Date(currentDate);
                startTime.setHours(10, 0, 0, 0);
                // Check if the target user has no other appointments during this period
                const slotsFilled = await SlotModel.find({
                    $or: [
                        { bookedById: userId },
                        { idNumber: userId }
                    ],
                    Slot: { $eq: startTime },
                });
                console.log(startTime);
                console.log(slotsFilled);
                if (slotsFilled.length === 0) {
                    availableSlots.push({
                        date: new Date(currentDate),
                        startTime: new Date(startTime),
                        duration: "1 hour",
                    });
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        res.json({message: "Available Slots", data: availableSlots});
    }
    catch (err) {
        res.send(err);
    }
});


// Checking the appointments scheduled
router.get('/appointments', decodeHeader, async (req, res) => {
    try {
        // if name of person exists in bookedFor
        const userId = req.user.num;
        console.log(userId);
        const fetchDetails = await SlotModel.find({
            idNumber: userId,
            Slot: { $gte: new Date() }
        });
        console.log(fetchDetails);
        if (fetchDetails.length === 0) {
            return res.status(400).json({message: "No appointments due." });
        }
        else {
            const appointments = await Promise.all(fetchDetails.map(async (appointment) => {
                const bookedById = appointment.bookedById;
                const bookedBy = await User.findOne({ num: bookedById });

                if (bookedBy) {
                    return {
                        bookedByName: bookedBy.name,
                        bookingId: appointment.bookedById,
                        timeSlot: appointment.Slot,
                    };
                }
            }));
            // console.log("The appointments are: " + appointments);
            return res.status(201).json({
                message: "Data found, you have some appointments.",
                data: appointments 
            });
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message:"Internal Server Error." });
    }
});


// Booking of Slots based on availability
router.post('/slotbook', decodeHeader, async (req, res) => {
    try {
        const userId = req.user.num;
        const { idNum, timeSlot } = req.body;
        const idNumber = parseInt(idNum);
        const dateObject = new Date(timeSlot);
        const entryExists = await SlotModel.findOne({ 
            // idNumber: idNumber,
            $or: [
                { bookedById: userId },
                { idNumber: idNumber }
            ],
            Slot: { $eq: dateObject }
        })
        if (idNumber === userId) {
            return res.send("Error, Booking person and Appointed person are same.");
        } else if (!(dateObject.getDay() === 4 || dateObject.getDay() === 5) && 
            !( dateObject.getHours() === 10 && 
              dateObject.getMinutes() === 0 && 
              dateObject.getSeconds() === 0
            )) {
                return res.json({message: "Selected Slot does not match with requirements: Thusday / Friday AND 10AM."});
            } else if (entryExists) {    
                return res.json({ message: "Entry already Exists. Try with different slots available." });
            } else {
                const timeNow = Date.now();
                console.log("\nSender: "+ userId,"\nSend To: "+ idNumber,"\nSlot: "+ dateObject);
                const newSlot = new SlotModel({
                    bookedById: userId,
                    idNumber: idNumber,
                    Slot: dateObject,
                    timestamp: timeNow,
                });
                newSlot.save();
                await SlotModel.findOne({timestamp: timeNow}).then((booking) => {
                    res.status(200).json({ message: "Slot booking successful", data: booking });
                }).catch((err) => {
                    res.json({ message: "Error while booking slot", data: err });
                })
            }
    } catch (err) {
        res.status(500).json({ message: "Internal server error.", data: err })
    }
});



module.exports = router;