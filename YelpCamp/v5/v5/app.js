var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var Campground=require("./models/campground");
var Comment=require("./models/comment")
var seedDB=require("./seeds");


// Campground.create(
//   {  name: "Salmon Creek", 
//      image:
//    "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//      description:"it is a very beautiful granite, no food, no water!!"
// },function(err,campground){
//   if(err){
// 	console.log("SOMETHIN GOES WRONG!");
//   }else{
// 	console.log("new campground has been added in");
// 	console.log(campground);
//   }
// });

mongoose.connect("mongodb://localhost:27017/yelp_camp_v5",{useNewUrlParser:true, useUnifiedTopology:true});


app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");
seedDB();
app.use(express.static("public"));

//PASSPORT CONFIG
app.use(require("express-session")({
  secret:"Once again, Chesnut is the best dog",
  resave:false,
  saveUninitialized:false
}));




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  next();
})

app.get("/",function(req,res){
  res.render("landing");
});

app.post("/campgrounds",function(req,res){
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

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,AllCampground){
	 if(err){
		console.log(err);
	 }else{
	   res.render("campground/index",{campground:AllCampground})
	 }
  });
});

app.get("/campgrounds/new",function(req,res){
  res.render("campground/new");
});

app.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
  if(err){
	console.log(err);
  }else{
	res.render("campground/show",{foundCampground:foundCampground});
  }
  });
});
//============
//COMMENTS ROUTE
//============
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,campground){
	 if(err){
		console.log(err);
	 }else{
		res.render("comment/new",{campground:campground});
	 }
  })
})

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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

//===========
//Authentication Route
//===========
//register form
app.get("/register",function(req,res){
  res.render("register");
});

//register logic
app.post("/register",function(req,res){
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
	  if(err){
		 console.log(err);
		 return res.render('register');
	  }
	  passport.authenticate("local")(req,res,function(){
		 res.redirect("/campgrounds");
	  })
  })
})

//show login form
app.get("/login",function(req,res){
  res.render("login");
})
//login logic
app.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	
})

//logout
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds")
});

//check if logged in
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
	  return next();
  }
	res.redirect("/login");
}


app.listen(3000,function(){
  console.log("YelpCamp APP has started!!")
});