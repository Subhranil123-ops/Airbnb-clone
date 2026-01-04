const express = require("express");
const router = express.Router();

// requiring error 
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");

// user models
const User = require("../model/user.js");

// requiring schema
const { signSchema } = require("../schema.js");
const validateUser = ((req, res, next) => {
    const result = signSchema.validate(req.body);
    if (result.error) {
        return next(new ExpressError(400, result.error));
    } else next();
})
// bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 12;

// passport
const passport = require("passport");


// sign up routes

// sign in page
router.get("/sign", validateUser,async (req, res) => {
    res.render("./users/sign.ejs");
});

// post form
router.post("/sign", validateUser, wrapAsync(async (req, res) => {
    try {
        req.body.sign.password = await bcrypt.hash(req.body.sign.password, saltRounds);
        const newUser = new User(req.body.sign);
        await newUser.save();
        req.flash("success", "You are successfully registered");
        res.redirect("/listing");
    }
    catch (e) {
        req.flash("failure", "This username or email is already in use. Please try another");
        return res.redirect("/users/sign");
    }
}));

// get form for login
router.get("/login",(req, res) => {
    res.render("users/login.ejs");
});
// post form for login
router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/users/login", failureFlash: {type:"failure",message:"Invalid username or password"}
    }),
    (req, res) => {
        req.flash("success", "You have successfully logged in to your account.");
        res.redirect("/listing")
    });
module.exports = router;




//  const user=await User.findOne({username:req.body.login.username});
//     if(user){

//         else{
//         req.flash("failure","No such account exits");
//         return res.redirect("/users/login");
//     }
//     }



