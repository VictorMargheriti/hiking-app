const mongoose = require("mongoose"),
Trail = require("./models/trail"),
Comment = require("./models/comment")

const data = [
	{
		name: "Cloud's rest",
		image: "https://images.unsplash.com/photo-1506535995048-638aa1b62b77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
		description: "blah blah blah"
	},
	{
		name: "Smoke Valley",
		image: "https://images.unsplash.com/photo-1523642595781-e7ce9855e4f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "blah blah blah"
	},
	{
		name: "Park Forest",
		image: "https://images.unsplash.com/photo-1589051355082-e983d7e81181?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "blah blah blah"
	}
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