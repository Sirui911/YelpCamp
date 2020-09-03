var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/reference_demo",{useNewUrlParser:true,useUnifiedTopology:true});

var postSchema= new mongoose.Schema({
  title:String,
  content:String
});

var Post=mongoose.model("Post",postSchema);

var userSchema=new mongoose.Schema({
  email:String,
  name:String,
  posts:[{
	  type: mongoose.Schema.Types.ObjectId,
	  ref:"Post"
  }
 ]
});

var User=mongoose.model("User",userSchema);

var newUser=new User({
  email:"sirui@gamil.com",
  name:"sirui"
});

Post.create({
  title:"Good",
  content:"this is really a good movie"
},function(err,post){
  User.findOne({name:"sirui"},function(err,foundUser){
  if(err){
	 console.log(err);
  }else{
  foundUser.posts.push(post);
  foundUser.save(function(err,data){
  if(err){
	console.log(err);
  }else{
	console.log(data);
  }
})
  }
  })
})


