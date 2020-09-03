//all the middleware go here
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
  if(req.isAuthenticated()){
	  return next();
  }
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwership=function(req,res,next){
	if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCampground){
	  if(err){
		 res.redirect("back"); 
	  }else{
		 if(foundCampground.author.id.equals(req.user._id)){
			next();  
		 }else{
			res.redirect("back");
		 }
	  }
  })
	}else{
	 res.redirect("back");
  }
}

middlewareObj.checkCommentOwership=function(req,res,next){
if(req.isAuthenticated()){
	 Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
	 if(err){
		res.redirect("back");
	 }else{
		if(updatedComment.author.id.equals(req.user._id)){
		 next();
		}else{
		 res.redirect("back");
		}
	 }
  }) 
  }else{
	  res.redirect("back");
  }
}

module.exports=middlewareObj