const express = require("express");
const router = express.Router();
const { validateUser, saveRedirect } = require("../middleware.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");

router
    .route("/sign")
    .get(userController.renderSignUpForm)
    .post(
        validateUser,
        wrapAsync(userController.signUp)
    )
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirect,
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: {
                type: "failure",
                message: "Invalid username or password"
            }
        }),
        userController.login
    )

router.get(
    "/logout",
    userController.logout
);

module.exports = router;







