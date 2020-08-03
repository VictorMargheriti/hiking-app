const express = require("express");
const router = express.Router();
const Trail = require("../models/trail");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/trails/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Trail.findById(req.params.id, function(err, trail){
		if(err){
			console.log(err)	
		} else {
			res.render("comments/new", {trail: trail})
		}
	})
})

router.post("/trails/:id/comments", middleware.isLoggedIn, function(req, res){
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
					//add username and id to comment
					comment.author.id = req.user._id
					comment.author.username = req.user.username
					//save comment
					comment.save()
					//push to comments
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

router.get("/trails/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back")
		} else {
			res.render("comments/edit", {trail_id: req.params.id, comment: foundComment})
		}
	})
})

router.put("/trails/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("/trails/" + req.params.id )
		}
	})
})

router.delete("/trails/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back")
		} else {
			res.redirect("back")
		}
	})
})

module.exports = router;