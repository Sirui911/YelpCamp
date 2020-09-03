var express=require("express");
var router=express.Router({mergeParams: true});
var Comment=require("../models/comment");
var Campground=require("../models/campground");
//============
//COMMENTS ROUTE
//============
router.get("/new",isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
	 if(err){
		console.log(err);
	 }else{
		res.render("comment/new",{campground:campground});
	 }
  })
})

router.post("/",isLoggedIn,function(req,res){
  //looking up campground using id
  Campground.findById(req.params.id,function(err,campground){
	 if(err){
		console.log(err);
		res.redirect("/campgrounds");
	 }else{
		//create new comment
		 Comment.create(req.body.comment,function(err,comment){
			if(err){
			  console.log(err);
			}else{
			  campground.comments.push(comment);
			  campground.save();
			  res.redirect('/campgrounds/'+campground._id);
			}
		 })
	 }
  })
})

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
	  return next();
  }
	res.redirect("/login");
}

module.exports=router;