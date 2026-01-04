// requiring express
const express = require("express");
const app = express();

// requiring mongoose
const mongoose = require("mongoose");

// requiring routes
const listings=require("./routes/listing");
const reviews=require("./routes/review");

// mongoose connection
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
    // user models
const User=require("./model/user.js");
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

const ExpressError = require("./utils/ExpressError");

// sessions 
const session=require("express-session");
const sessionOptions={
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions));

// flash
const flash=require("connect-flash");
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    next();
});

// USING ROUTES
app.use("/listing",listings);
app.use("/listing/:listingId/reviews",reviews);

// sign up routes

// sign in page
app.get("/sign",async(req,res)=>{
    res.render("sign.ejs");
});
// post form
app.post("/sign/userId",async(req,res)=>{
    console.log(req.body.user);
    const newUser=new User(req.body.user)
    await newUser.save();
    res.send("ok");
});

// RUNS WHEN ROUTE IS WRONG
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err.name);
    console.log(err.stack);
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("app is listenting on the port : 3000");
});



