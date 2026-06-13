const express = require("express");
const router = express.Router();
const User = require('../models/users');
const wrapAsync = require('../utils/wrapAsync');

router.get('/signup' , (req , res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {email , username , password} = req.body;
    const newUser = new User({email , username});
    await User.register(newUser  , password);
    req.flash("success" , "Welcome to Turfmate!!");
    res.redirect("/turfs");
    }catch(er){
        req.flash("error" , er.message);
        res.redirect("/signup");
    }
}))

module.exports = router;