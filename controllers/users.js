const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const saltRounds = 12;

module.exports.renderSignUpForm = (req, res) => {
    res.render("./users/sign.ejs");
}

module.exports.signUp = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
    const redirect = res.locals.redirect || "/listing";
    req.flash("success", "You have successfully logged in to your account.");
    res.redirect(redirect);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        else {
            req.flash("success", "You have been successfullly logged out");
            return res.redirect("/listing");
        }
    });
} 
