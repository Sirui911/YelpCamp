var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/embed_demo",{useNewUrlParser:true,useUnifiedTopology:true});

var postSchema= new mongoose.Schema({
  title:String,
  content:String
});

var Post=mongoose.model("Post",postSchema);

var userSchema=new mongoose.Schema({
  email:String,
  name:String,
  posts:[postSchema]
});

var User=mongoose.model("User",userSchema);

var newUser=new User({
  email:"sirui@gamil.com",
  name:"sirui"
});


newUser.posts.push({
  title:"harry potter is excellent",
  content:"it is very good"
});

newUser.save(function(err,user){
  if(err){
	console.log(err);
  }else{
	console.log(user);
  }
})

