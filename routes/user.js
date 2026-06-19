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

        const {
            username,
            email,
            password,
            role
        } = req.body;

        const newUser = new User({
            email,
            username,
            role
        });

        const registeredUser =
            await User.register(
                newUser,
                password
            );

        req.login(
            registeredUser,
            (err)=>{

                if(err){
                    return next(err);
                }

                req.flash(
                    "success",
                    "Welcome to TurfMate!!"
                );

                if(
                    registeredUser.role ===
                    "owner"
                ){
                    return res.redirect(
                        "/owner/dashboard"
                    );
                }

                res.redirect("/turfs");

            }
        );

    }catch(er){

        req.flash(
            "error",
            er.message
        );

        res.redirect("/signup");
    }
}));

router.get('/login' , (req, res)=>{
    res.render("users/login.ejs");
})

router.post(
    '/login',
    passport.authenticate(
        "local",
        {
            failureRedirect:'/login',
            failureFlash:true
        }
    ),
    (req,res)=>{

        req.flash(
            "success",
            "Welcome back to TurfMate!!"
        );

        if(req.user.role === "owner"){
            return res.redirect(
                "/owner/dashboard"
            );
        }

        res.redirect("/turfs");
    }
);

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