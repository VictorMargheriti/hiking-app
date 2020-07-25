const express   			= require("express"),
    app         			= express(),
    bodyParser  			= require("body-parser"),
    mongoose    			= require("mongoose"),
	Trail					= require("./models/trail"),
    seedDB      			= require("./seeds"),
	Comment 				= require("./models/comment"),
	User 					= require("./models/user"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose")

const commentRoutes = require("./routes/comments"),
	  trailRoutes = require("./routes/trails"),
	  indexRoutes = require("./routes/index")
    
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

app.use(indexRoutes);
app.use(commentRoutes);
app.use(trailRoutes);

//HEROKU PORT

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Our app is running on port ${ PORT }`);
// });

app.listen(300, function(){
	console.log("Chikkin's Hiking server hosted at port 300")
})