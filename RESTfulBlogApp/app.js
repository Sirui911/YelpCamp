var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
	expressSanitizer=require("express-sanitizer");
	mongoose=require("mongoose"),
    methodOverride=require("method-override");

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extend:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE.MODEL CONFIG
var blogSchema=new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  create:{
	 type:Date,
	 default:Date.now
  }
});
var Blog=mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES
app.get("/",function(req,res){
  res.redirect("index");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
	if(err){
	  console.log(err);
	}else{
	  res.render("index",{blogs:blogs});
	}
  });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
  res.render("new");
})

//CREATE ROUTE
app.post("/blogs",function(req,res){
  req.body.blog.body=req.sanitize(req.body.blog.body);	
  Blog.create(req.body.blog,function(err,NewBlog){
	 if(err){
	    res.render("new");
	 }else{
	    //redirect to index page
		res.redirect("/blogs");
	 }
  });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
 Blog.findById(req.params.id,function(err,foundBlog){
	if(err){
	  console.log(err);
	}else{
	  res.render("show",{foundBlog:foundBlog});
	}
});
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
	if(err){
	  console.log(err);
	}else{
	  res.render("edit",{blog:foundBlog});
	}
  })
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
  console.log(req.body);
  req.body.blog.body=req.sanitize(req.body.blog.body);
  console.log("=======");
  console.log(req.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
	if(err){
	  res.redirect("/blogs");
	}else{
	  res.redirect("/blogs/"+req.params.id);
	}
  })
})

//DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
  //delete blog
  Blog.findByIdAndRemove(req.params.id,function(err){
  if(err){
  res.redirect("/blogs");
  }else{
	//redirect to somewhere
	   res.redirect("/blogs");
	 }
	 })
});

app.listen(3000,function(){
  console.log("Blog App has been started!!");
});
