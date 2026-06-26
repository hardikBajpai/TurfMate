const mongoose = require('mongoose');
const initData = require('./data.js');
const Turf = require('../models/turfs');

const MONGO_URL = 'mongodb://127.0.0.1:27017/turfmate';

main().then(()=>{
  console.log("Connected to DB ");
}).catch((err)=>{
  console.log("Error in connecting DB");
});

async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Turf.deleteMany({});
    await Turf.insertMany(initData);
    console.log("Data has been initialized!!");
}

initDB();