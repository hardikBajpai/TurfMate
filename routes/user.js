const express = require("express");
const router = express.Router();
const User = require('../models/users');
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");

router.get('/signup' , (req , res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {email , username , password} = req.body;
    const newUser = new User({email , username});
    const registeredUser =  await User.register(newUser  , password);

    req.login(registeredUser ,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "Welcome to Turfmate!!");
        res.redirect("/turfs"); 
    } )
    
    
    }catch(er){
        req.flash("error" , er.message);
        res.redirect("/signup");
    }
}))

router.get('/login' , (req, res)=>{
    res.render("users/login.ejs");
})

router.post('/login' , passport.authenticate("local" , {failureRedirect:'/login' , failureFlash:true}) , async(req , res)=>{
    req.flash("success" , "Welcome back to Turfmate!!");
    res.redirect("/turfs");
})

router.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
      if(err){
       return next(err);
      }

      req.flash("success" , "you are logged out!!");
      res.redirect("/turfs");
    })
})
module.exports = router;