const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user")

router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
res.render("register");
});

//handle signup logic
 router.post("/register", function(req, res){
	const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/trails");
            })
        }
    })
})

//show login form
router.get("/login", (req, res)=> {
    res.render("login", {referer:req.headers.referer});
});

//handle login logic
router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), (req, res) => {
    if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-6) !== "/login")) {
        res.redirect(req.body.referer);
    } else {
        res.redirect("/");
    }
});

// logout route
router.get("/logout", (req, res)=> {
	req.logout();
	req.flash("success", "You have been logged out.");
	res.redirect("/trails");
});


module.exports = router;