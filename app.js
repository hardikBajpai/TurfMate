const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Turf = require('./models/turfs');
const path = require("path");
const ejsMate = require("ejs-mate");
const Review = require('./models/review')
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {reviewSchema} = require("./schema.js");
const methodOverride = require("method-override");

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
app.use(methodOverride("_method"));

//validate Review Middleware
const validateReview = (req , res , next)=>{
  let {error} = reviewSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el)=>{el.message}).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
  
}

//Index Route
app.get('/turfs' , wrapAsync(async(req , res)=>{
 const allTurfs = await Turf.find({});
 res.render("turfs/index.ejs" , {allTurfs});
}))

//Show Route
app.get('/turfs/:id' , wrapAsync(async(req , res)=>{
  let {id} = req.params;
  let turf = await Turf.findById(id).populate("reviews");
  res.render("turfs/show.ejs" , {turf});
}))

//Review Post Route
app.post('/turfs/:id/reviews' ,validateReview,wrapAsync(async(req,res , next)=>{

  let turf = await Turf.findById(req.params.id);
  let newReview = new Review(req.body.review);

  turf.reviews.push(newReview);

  await newReview.save();
  await turf.save();

  res.redirect(`/turfs/${turf._id}`);
  }))

//Review delete route

app.delete("/turfs/:id/reviews/:reviewId" , wrapAsync(async(req , res)=>{
  let {id , reviewId} = req.params;
  await Turf.findByIdAndUpdate(id ,{$pull :{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  
  res.redirect(`/turfs/${id}`);

}))

app.get('/' , (req,res)=>{
  res.send("Hi , I am running");
})


app.get('/about' , (req,res)=>{
  res.render("turfs/about.ejs")
})

app.use((req,res,next)=>{
  next(new ExpressError(404 , "Page Not Found!"));
})

app.use((err , req , res , next)=>{
  let {statusCode=500 , message="Something went wrong!"} = err;
  res.render("error.ejs" , {message});
})


app.listen(port , ()=>{
   console.log(`Server is Listening to PORT ${port} `)
})



