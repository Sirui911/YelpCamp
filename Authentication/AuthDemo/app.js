var express=require("express"),
	mongoose=require("mongoose"),
	passport=require("passport"),
	bodyParser=require("body-parser"),
	localStrategy=require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
    User=require("./models/user");

mongoose.connect('mongodb://localhost:27017/',{useNewUrlParser:true,useUnifiedTopology:true});


var app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret:"Chesnut is the best dog in the world!",
  resave:false,
  saveUninitialized:false	
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============
//route
//=============
app.get("/",function(req,res){
  res.render("home");
})

app.get("/secret",isLoggedIn,function(req,res){
  res.render("secret");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  req.body.username
  req.body.password
  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
	 if(err){
		console.log(err);
		return res.render('register');
	 }
		passport.authenticate("local")(req,res,function(){
		  res.redirect("/secret");
		});
  });
});

//login route
app.get("/login",function(req,res){
  res.render("login");
});
//login logic
app.post("/login",passport.authenticate("local",{
	successRedirect:"/secret",
	failureRedirect:"/login"
}),function(req,res){
	
});

//logout route
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
})

//check if login
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
	  return next();
  }
	res.redirect('/login')
}

app.listen(3000,function(){
  console.log("app has started!!");
})
