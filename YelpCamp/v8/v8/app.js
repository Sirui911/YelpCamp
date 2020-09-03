var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var Campground=require("./models/campground");
var Comment=require("./models/comment")
var seedDB=require("./seeds");
var methodOverride=require("method-override");

//require routes
var commentRoutes=require("./routers/comments"),
	campgroundRoutes=require("./routers/campgrounds"),
	indexRoutes=require("./routers/index");


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
//seedDB(); //seed the database
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

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
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");//locals有啥用
  next();
})


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3000,function(){
  console.log("YelpCamp APP has started!!")
});