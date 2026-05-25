const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Turf = require('./models/turfs');

const MONGO_URL = 'mongodb://127.0.0.1:27017/turfmate';

main().then(()=>{
  console.log("Connected to DB ");
}).catch((err)=>{
  console.log("Error in connecting DB");
});

async function main(){
   await mongoose.connect(MONGO_URL);
}

app.get('/test' , (req , res)=>{
  let sampleTurf = new Turf( {
    name:"Kanpur Turf",
    price:2000,
  })

  sampleTurf.save();
  console.log(sampleTurf);
  res.send("Done");
})


app.listen(port , ()=>{
   console.log(`Server is Listening to PORT ${port} `)
})

app.get('/' , (req,res)=>{
  res.send("Hi , I am running");
})