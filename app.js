require('dotenv').config()

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const Turf = require('./models/turfs');
const path = require("path");
const ejsMate = require("ejs-mate");
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/users');
const Booking = require('./models/booking.js');

const turfsRouter = require("./routes/turfs.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const ownerRouter = require("./routes/owner.js");


const MONGO_URL = process.env.ATLASDB_URL;

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

app.get('/' , (req,res)=>{
  res.redirect("/home");
})

const store = MongoStore.create({
  mongoUrl :  MONGO_URL,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter : 24 * 3600,
})

const sessionOptions  = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})


app.use('/turfs' , turfsRouter);
app.use('/turfs/:id/reviews' , reviewsRouter);
app.use('/user' , usersRouter);
app.use('/owner' , ownerRouter);

app.get('/home' , (req,res)=>{
  res.render("turfs/home.ejs");
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



