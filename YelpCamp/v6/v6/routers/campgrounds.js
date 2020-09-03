var express=require("express");
var router=express.Router();
var Campground=require("../models/campground")

//add new campgrounds to db
router.post("/",function(req,res){
  var name=req.body.name;
  var image=req.body.image;
  var desc=req.body.description;
  var newCamp={name:name,image:image,description:desc}
  Campground.create(newCamp,function(err,newlyCreated){
	if(err){
	  console.log(err);
	}else{
	  //redirect back to campground page
	  res.redirect("/campgrounds")
	}
  });
})

//show all the campgrounds
router.get("/",function(req,res){
    Campground.find({},function(err,AllCampground){
	 if(err){
		console.log(err);
	 }else{
	   res.render("campground/index",{campground:AllCampground})
	 }
  });
});

//show form to create new campground
router.get("/new",function(req,res){
  res.render("campground/new");
});

//show the detail of the campground SHOW
router.get("/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
  if(err){
	console.log(err);
  }else{
	res.render("campground/show",{foundCampground:foundCampground});
  }
  });
});

module.exports=router;