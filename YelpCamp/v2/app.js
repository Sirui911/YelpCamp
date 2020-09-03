var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology:true});

//SCHEMA SETUP
var campgroundSchema=new mongoose.Schema({
  name:String,
  image:String,
  description:String
});
var Campground=mongoose.model("Campground",campgroundSchema);

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


app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");
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
	   res.render("index",{campground:AllCampground})
	 }
  });
});

app.get("/campgrounds/new",function(req,res){
  res.render("new");
});

app.get("/campgrounds/:id",function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
  if(err){
	console.log(err);
  }else{
	res.render("show",{foundCampground:foundCampground});
  }
  });
});

app.listen(3000,function(){
  console.log("YelpCamp APP has started!!")
});