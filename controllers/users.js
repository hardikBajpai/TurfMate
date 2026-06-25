const User = require('../models/users');


module.exports.userSignup = (req , res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignup = async(req,res)=>{
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
};

module.exports.userLogin =  (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.postLogin = (req,res)=>{

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
    };

    module.exports.userLogout =  (req , res , next)=>{
    req.logout((err)=>{
      if(err){
       return next(err);
      }

      req.flash("success" , "you are logged out!!");
      res.redirect("/home");
    })
};