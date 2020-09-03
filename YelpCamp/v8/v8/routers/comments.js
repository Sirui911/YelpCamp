var express=require("express");
var router=express.Router({mergeParams: true});
var Comment=require("../models/comment");
var Campground=require("../models/campground");
var middleware=require("../middleware");
//============
//COMMENTS ROUTE
//============
//show form to create comments
router.get("/new",middleware.isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
	 if(err){
	 req.flash("error","campground not found");
	 res.redirect("/campgrounds")
	 }else{
		res.render("comment/new",{campground:campground});
	 }
  })
})

//comment creation logic
router.post("/",middleware.isLoggedIn,function(req,res){
  //looking up campground using id
  Campground.findById(req.params.id,function(err,campground){
	 if(err){
		console.log(err);
		req.flash("error","something goes wrong");
		res.redirect("/campgrounds");
	 }else{
		//create new comment
		 Comment.create(req.body.comment,function(err,comment){
			if(err){
			  console.log(err);
			}else{
			  //add username and id into comments
			  comment.author.id=req.user._id;
			  comment.author.username=req.user.username;
			  //save comments
			  comment.save();
			  campground.comments.push(comment);
			  campground.save();
			  req.flash("success","successful create comment");
			  res.redirect('/campgrounds/'+campground._id);
			}
		 })
	 }
  })
})

//edit comment form
router.get("/:comment_id/edit",middleware.checkCommentOwership,function(req,res){

  Comment.findById(req.params.comment_id,function(err,foundComment){
	 if(err){
	   req.flash("error","something goes wrong");
		res.redirect("back")
;	 }else{
		res.render("comment/edit",{comment:foundComment,campground_id:req.params.id});
	 }
  })
})

//edit comment logic
router.put("/:comment_id",middleware.checkCommentOwership,function(req,res){	 Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
	     req.flash("success","comment has been created");
		 res.redirect("/campgrounds/"+req.params.id);	
  }) 
})

//delete comments
router.delete("/:comment_id",middleware.checkCommentOwership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
	 if(err){
	    req.flash("error","something goes wrong");
		res.redirect("back");
	 }else{
	    req.flash("success","successful delete");
		res.redirect("/campgrounds/"+req.params.id);
	 }
  })
})


module.exports=router;