var mongoose=require("mongoose"),
	Campground=require("./models/campground"),
	Comment=require("./models/comment");

var data=[
  {
	name:"Fig.1",
	image:"https://images.unsplash.com/photo-1497993950456-cdb57afd1cf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
	description:"this is a black dog"
  },
  {
	name:"Fig.2",
	image:"https://images.unsplash.com/photo-1491930722919-a5fc9ad49a75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
	description:"this is a yellow dog"
  },
  {
	name:"Fig.3",
	image:"https://images.unsplash.com/photo-1532397476918-0b485c271c7f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
	description:"this is a white dog"
  }
]
function seedDB(){
Campground.remove({},function(err){
  if(err){
	console.log(err);  
  }else{
	console.log("data has been removed!!");
	Comment.remove({},function(err){
	  if(err){
		console.log(err);
	  }else{
		console.log("comments has also been removed!!");
		data.forEach(function(seed){
	    Campground.create(seed,function(err,campground){
		 if(err){
		   console.log(err);
		 }else{
		   console.log("added a campground");
		   Comment.create({
			  content:"this is great!!",
			  author:"Bob"
		   },function(err,comment){
			  if(err){
				 console.log(err);
			  }else{
				 campground.comments.push(comment);
				 campground.save();
				 console.log("comment has been create!");
			  }
		   })
		   
		 }
	  })
	})
	  }
	})
  } 
})
}

module.exports=seedDB;