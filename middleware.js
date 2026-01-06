module.exports.isLoggedin = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in to make any changes !");
        res.redirect("/users/login");
    } else next();
});
module.exports.saveRedirect = ((req, res, next) => {
    if(req.session.redirectUrl){
    res.locals.redirect = req.session.redirectUrl;
    console.log(res.locals.redirect);
    }
    next();
})