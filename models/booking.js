const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    turf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turf",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["booked", "cancelled"],
        default: "booked"
    }
});

module.exports = mongoose.model("Booking", bookingSchema);