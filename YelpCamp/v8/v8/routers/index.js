var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
  res.render("landing");
});
//===========
//Authentication Route
//===========
//register form
router.get("/register",function(req,res){
  res.render("register");
});

//register logic
router.post("/register",function(req,res){
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
	  if(err){
		 console.log(err);
		 req.flash("error",err.message);
		 return res.redirect("/register");
	  }
	  passport.authenticate("local")(req,res,function(){
		 req.flash("success","Welcome to Yelpcamp");
		 res.redirect("/campgrounds");
	  })
  })
})

//show login form
router.get("/login",function(req,res){
  res.render("login");
})
//login logic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	
})

//logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Successfully logout");
	res.redirect("/campgrounds")
});


module.exports=router;
