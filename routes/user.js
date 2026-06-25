const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");

const userController = require("../controllers/users");

// Get signup form
router.get('/signup' , userController.userSignup);

//Submit signup form
router.post("/signup",wrapAsync(userController.postSignup));

//Get Login form
router.get('/login' , userController.userLogin);

//Submit Login form
router.post(
    '/login',
    passport.authenticate(
        "local",
        {
            failureRedirect:'/user/login',
            failureFlash:true
        }
    ),
    userController.postLogin
);

//Logout route
router.get("/logout" , userController.userLogout);

module.exports = router;