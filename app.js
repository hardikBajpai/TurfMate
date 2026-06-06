const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Turf = require('./models/turfs');
const path = require("path");
const ejsMate = require("ejs-mate");

const MONGO_URL = 'mongodb://127.0.0.1:27017/turfmate';

main().then(()=>{
  console.log("Connected to DB ");
}).catch((err)=>{
  console.log("Error in connecting DB");
});

async function main(){
   await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs' , ejsMate);
app.use(express.static("public"));

//Index Route
app.get('/turfs' , async(req , res)=>{
 const allTurfs = await Turf.find({});
 res.render("turfs/index.ejs" , {allTurfs});
})

//Show Route
app.get('/turfs/:id' , async(req , res)=>{
  let {id} = req.params;
  let turf = await Turf.findById(id);
  res.render("turfs/show.ejs" , {turf});
})

app.get('/about' , (req,res)=>{
  res.render("turfs/about.ejs")
})


app.listen(port , ()=>{
   console.log(`Server is Listening to PORT ${port} `)
})

app.get('/' , (req,res)=>{
  res.send("Hi , I am running");
})