var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");//do not need to slash index,because it will automatically ref it

//add new campgrounds to db
router.post("/",middleware.isLoggedIn,function(req,res){
  var name=req.body.name;
  var image=req.body.image;
  var desc=req.body.description;
  var author={
	 id:req.user._id,
	 username:req.user.username
  }
  var newCamp={name:name,image:image,description:desc,author:author}
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
router.get("/new",middleware.isLoggedIn,function(req,res){
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

//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
	res.render("campground/edit",{campground:foundCampground});   
  })
})

//update campground routes
router.put("/:id",middleware.checkCampgroundOwership,function(req,res){	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
	  if(err){
		 res.redirect("/");
	  }else{
		 res.redirect("/campgrounds/"+req.params.id);
	  }
	})
})

//delete campground
router.delete("/:id",middleware.checkCampgroundOwership,function(req,res){
  //find the campgrounds
  Campground.findByIdAndRemove(req.params.id,function(err){
	  if(err){
		 res.redirect("/campgrounds");
	  }else{
		  //redirect to somewhere
		 res.redirect("/campgrounds");
	  }
  })
})


module.exports=router;