var express=require("express");
var app=express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");
var campground=[
	 {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
  ]

app.get("/",function(req,res){
  res.render("landing");
});

app.post("/campgrounds",function(req,res){
  var name=req.body.name;
  var image=req.body.image;
  var newCamp={name:name,image:image}
  campground.push(newCamp);
  res.redirect("/campgrounds")
})

app.get("/campgrounds",function(req,res){
  res.render("campgrounds",{campground:campground})
});

app.get("/campgrounds/new",function(req,res){
  res.render("new");
})

app.listen(3000,function(){
  console.log("YelpCamp APP has started!!")
});