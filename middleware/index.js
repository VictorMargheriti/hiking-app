const Trail = require("../models/trail");
const Comment = require("../models/comment");
//ALL MIDDLEWARE IN HERE
const middlewareObj = {};

middlewareObj.checkTrailOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Trail.findById(req.params.id, function(err, foundTrail){
			if(err){
				req.flash("error", "Trail not found")
				res.redirect("back");
			} else {
				if(foundTrail.author.id.equals(req.user._id)){
					next()
			} else {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back");
			}
			}
		})
	} else {
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next()
			} else {
				res.redirect("error", "You don't have permission to do that")
				res.redirect("back");
			}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}


module.exports = middlewareObj;