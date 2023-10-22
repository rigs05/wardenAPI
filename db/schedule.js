const { Schema, model } = require('mongoose');

const slotSchema = new Schema ({
    timestamp: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    bookedById: {
        type: Number,
        required: true,
    },
    idNumber: {
        type: Number,
        required: true,
    },
    Slot: {
        type: Date,
        required: true,
    }
})

const SlotModel = model('slots', slotSchema);

module.exports = { SlotModel };