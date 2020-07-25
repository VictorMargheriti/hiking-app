const express = require("express");
const router = express.Router();
const Trail = require("../models/trail")

router.get("/trails", function(req, res){
    Trail.find({}, function(err, allTrails){
       if(err){
           console.log(err);
       } else {
          res.render("trails/index",{trail: allTrails, currentUser: req.user});
       }
    });
});

router.post("/Trails", function(req, res){
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

router.get("/trails/new", function(req, res){
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

module.exports = router;
