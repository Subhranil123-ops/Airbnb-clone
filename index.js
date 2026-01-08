require("dotenv").config();
const express = require("express");
const app = express();
const User = require("./model/user");
const mongoose = require("mongoose");
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const users = require("./routes/user");
const ExpressError = require("./utils/ExpressError");
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

// ejs
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Overrides
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// boilerplate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public files
app.use(express.static(path.join(__dirname, "public")));



// sessions 
const session = require("express-session");
const sessionOptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.authenticated = req.user;
    next();
});

// Customized usernameField and passwordField to match the nested
// form input names instead of Passport's default fields.
passport.use(new LocalStrategy(
    {
        usernameField: "login[username]",
        passwordField: "login[password]"
    },
    async (username, password, done) => {
        try {
            let user = await User.findOne({ username });
            if (!user) return done(null, false);
            const hash = user.password;
            const match = await bcrypt.compare(password, hash);
            if (!match) {
                return done(null, false)
            } if (user && match) return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (user) return done(null, user);
        else return done(null, false);
    }
    catch (err) {
        return done(err);
    }
})

// USING ROUTES
app.use("/listing", listings);
app.use("/listing/:listingId", reviews);
app.use("/users", users);


// RUNS WHEN ROUTE IS WRONG
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err.name);
    console.log(err.stack);
    let { status = 500, message = "Something went wrong" } = err;
    if (err.message === 'ValidationError: "user.password" length must be at least 8 characters long') {
        req.flash("failure", "Password must be at least 8 characters long and include a special character and a number");
        return res.redirect("/users/sign")
    }
    res.status(status).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("app is listenting on the port : 3000");
});



