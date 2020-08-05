const express = require("express");
const router = express.Router();
const Trail = require("../models/trail");
const middleware = require("../middleware");

router.get("/trails", function(req, res){
    Trail.find({}, function(err, allTrails){
       if(err){
           console.log(err);
       } else {
          res.render("trails/index",{trail: allTrails, currentUser: req.user});
       }
    });
});

router.post("/Trails", middleware.isLoggedIn, function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	}
    const newTrail = {name: name, image: image, description: desc, author: author}
    Trail.create(newTrail, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/trails");
        }
    });
});

router.get("/trails/new", middleware.isLoggedIn, function(req, res){
   res.render("trails/new.ejs"); 
});

router.get("/trails/:id", function(req, res){
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail){
        if(err){
            console.log(err);
        } else {
            res.render("trails/show", {trail: foundTrail});
        }
    });
})


//EDIT TRAIL ROUTE
router.get("/trails/:id/edit", middleware.checkTrailOwnership, function(req, res){
	Trail.findById(req.params.id, function(err, foundTrail){
		res.render("trails/edit", {trail: foundTrail})
		})
})
//UPDATE TRAIL ROUTE
router.put("/trails/:id", middleware.checkTrailOwnership, function(req, res){
	//find and update the correct trails
	Trail.findByIdAndUpdate(req.params.id, req.body.trail, function(err, updatedTrail){
		if(err){
			res.redirect("/trails")
		} else {
			res.redirect("/trails/" + req.params.id)
		}
	})
})

//DESTROY TRAIL ROUTE
router.delete("/trails/:id", middleware.checkTrailOwnership, function(req, res){
	Trail.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/trails")
		} else {
			req.flash("success", "Successfully deleted Trail")
			res.redirect("/trails")
		}
	})
})

module.exports = router;
