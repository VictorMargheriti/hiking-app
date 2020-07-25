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
router.get("/login", function(req, res){
	res.render("login")
})

//handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/trails",
	failureRedirect: "/login"
}), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/trails");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

module.exports = router;