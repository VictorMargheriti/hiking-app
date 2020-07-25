const express = require("express");
const router = express.Router();
const Trail = require("../models/trail");
const Comment = require("../models/comment")

router.get("/trails/:id/comments/new", isLoggedIn, function(req, res){
	Trail.findById(req.params.id, function(err, trail){
		if(err){
			console.log(err)	
		} else {
			res.render("comments/new", {trail: trail})
		}
	})
})

router.post("/trails/:id/comments", isLoggedIn, function(req, res){
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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

module.exports = router;