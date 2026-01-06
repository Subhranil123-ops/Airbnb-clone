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
const { saveRedirect } = require("../middleware.js");

// sign up routes
// sign in page
router.get("/sign", validateUser, async (req, res) => {
    res.render("./users/sign.ejs");
});

// post form
router.post("/sign",
    validateUser,
    wrapAsync(async (req, res, next) => {
        try {
            req.body.sign.password = await bcrypt.hash(req.body.sign.password, saltRounds);
            const newUser = new User(req.body.sign);
            await newUser.save();
            req.login(newUser, (err) => {
                if (err) return next(err);
                req.flash("success", "Registration successful! You’re now logged in and ready to go.");
                return res.redirect("/listing");
            })
        } catch (e) {
            req.flash("failure", "This username or email is already in use. Please try another");
            return res.redirect("/users/sign");
        }
    }));

// get form for login
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// post form for login
router.post("/login",
    saveRedirect,
    passport.authenticate("local",
        {
            failureRedirect: "/users/login",
            failureFlash: {
                type: "failure",
                message: "Invalid username or password"
            }
        }),
    (req, res) => {
        const redirect = res.locals.redirect || "/listing";
        req.flash("success", "You have successfully logged in to your account.");
        res.redirect(redirect);
    });

// logout 
router.get("/logout",
    (req, res, next) => {
        if (req.user) {
            req.logout((err) => {
                if (err) return next(err);
                else {
                    req.flash("success", "You have been successfullly logged out");
                    return res.redirect("/listing");
                }
            });
        } else {
            return res.redirect("/listing");
        }
    })
module.exports = router;







