const express   			= require("express"),
    app         			= express(),
    bodyParser  			= require("body-parser"),
    mongoose    			= require("mongoose"),
    Trail  					= require("./models/trail"),
    seedDB      			= require("./seeds"),
	Comment 				= require("./models/comment"),
	User 					= require("./models/user"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose")
    
mongoose.connect("mongodb://localhost/hiking_app", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true  });
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
seedDB()

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Benny is the cutest Dog in the world",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// TRAIL ROUTES

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/trails", function(req, res){
    Trail.find({}, function(err, allTrails){
       if(err){
           console.log(err);
       } else {
          res.render("trails/index",{trail: allTrails, currentUser: req.user});
       }
    });
});

app.post("/Trails", function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newTrail = {name: name, image: image, description: desc}
    Trail.create(newTrail, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/trails");
        }
    });
});

app.get("/trails/new", function(req, res){
   res.render("trails/new.ejs"); 
});

app.get("/trails/:id", function(req, res){
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail){
        if(err){
            console.log(err);
        } else {
            res.render("trails/show", {trail: foundTrail});
        }
    });
})

//COMMENTS ROUTES

app.get("/trails/:id/comments/new", isLoggedIn, function(req, res){
	Trail.findById(req.params.id, function(err, trail){
		if(err){
			console.log(err)	
		} else {
			res.render("comments/new", {trail: trail})
		}
	})
})

app.post("/trails/:id/comments", isLoggedIn, function(req, res){
	//lookup trail using ID
	Trail.findById(req.params.id, function(err, trail){
		if(err){
			console.log(err)
			res.redirect("/trails")
		} else {
			//create new comments
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				} else {
					trail.comments.push(comment)
					//connect new comment to trail
					trail.save()
					//redirect trail show page
					res.redirect("/trails/" + trail._id)
				}
			})
		}
	})
	

})

// AUTH ROUTES

//show register form
app.get("/register", function(req, res){
res.render("register");
});

//handle signup logic
 app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
	res.render("login")
})

//handle login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/trails",
	failureRedirect: "/login"
}), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/trails");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});