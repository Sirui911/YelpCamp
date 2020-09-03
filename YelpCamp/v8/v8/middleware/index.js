//all the middleware go here
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
  if(req.isAuthenticated()){
	  return next();
  }
	req.flash("error","you need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwership=function(req,res,next){
	if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCampground){
  if(err){
	 req.flash("error","campgrpund not found");
	 res.redirect("back"); 
  }else{
	  
	 if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
	 if(foundCampground.author.id.equals(req.user._id)){
		next();  
	 }else{
	  req.flash("error","You don't have permission to do that");
	 res.redirect("back");
	 }
  }
	})
	}else{
	 req.flash("error","You need to be logged in to do that");
	 res.redirect("back");
	}
	}

middlewareObj.checkCommentOwership=function(req,res,next){
if(req.isAuthenticated()){
	 Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
	 if(err){
		 req.flash("error","Comment not found");
		res.redirect("back");
	 }else{
		  // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
		 if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
	 // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
		if(updatedComment.author.id.equals(req.user._id)){
		 next();
		}else{
		 req.flash("error","You do not have permission to do that");
		 res.redirect("back");
		}
	 }
  }) 
  }else{
	  req.flash("error","You need to be logged in to do that");
	  res.redirect("back");
  }
}

module.exports=middlewareObj