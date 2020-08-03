const mongoose = require("mongoose"),
Trail = require("./models/trail"),
Comment = require("./models/comment")

const data = [
	
]

function seedDB(){
	//remove all trails
	Trail.deleteMany({}, function(err){
	if(err){
		console.log(err)
	} else {
	console.log("removed Trails")
	}
		//add a few trails
	data.forEach(function(seed){
            Trail.create(seed, function(err, trail){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a trail");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                trail.comments.push(comment);
                                trail.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;