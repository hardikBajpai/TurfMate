const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const initData = require('./data.js');
const Turf = require('../models/turfs');

const MONGO_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/turfmate';

async function initDB() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB successfully");
        await Turf.deleteMany({});
        await Turf.insertMany(initData);
        console.log("Data has been initialized!!");
    } catch (err) {
        console.error("Error in DB operation:", err);
    } finally {
        await mongoose.connection.close();
        console.log("DB connection closed.");
    }
}

initDB();