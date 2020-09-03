var express=require("express");
var app=express();

app.set("view engine","ejs");

//routes
app.get("/",function(req,res){
  res.render("home");
})

app.get("/about",function(req,res){
  res.render("about");
})

app.listen(3000,function(){
  console.log("YelpCamp APP has started!!")
});
