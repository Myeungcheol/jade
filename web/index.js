
var express = require('express');  //express
var path = require('path'); //set path
var app = express();
var mongoose = require('mongoose'); //mongodb connector
var bodyParser = require('body-parser'); //http : post data paser(body)
var methodOverride = require('method-override'); // override delete method

var jquery = require('jquery');

var jsdom = require('jsdom');
// var window = jsdom.jsdom().createWindow();
// var $ = require('jquery')(window);

//db connection
mongoose.connect("mongodb://test:test@ds021462.mlab.com:21462/smart01");
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected !");
});

db.on("error", function(){
  console.log("DB ERROR:", err);
});

//server on
app.listen(2000, function(){
  console.log('Server On!');
});

//create db schema
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

//create Model  --> collection name : post // for Schema : postSchema
var Post = mongoose.model('post', postSchema);

// linking
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); //recive
app.use(bodyParser.urlencoded({extended:true})); //send
app.use(methodOverride("_method")); // delete sign override

//rout setting
app.get('/posts/setting', function(req, res){
  Post.find({}).sort('-createdAt').exec(function(err, posts){
    if(err) return res.json({success:false, message:err});
    res.render('posts/setting', {data:posts});
  });
});

app.put('/posts/setting/:id', function(req, res){
    req.body.post.updatedAt=Date.now();
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.redirect('/posts/setting');
    });
  }); //update


//set route
app.get('/posts', function(req, res){
  Post.find({}).sort('-createdAt').exec(function(err, posts){
    if(err) return res.json({success:false, message:err});
    res.render("posts/index", {data:posts});
  });
}); // index

app.get('/posts/new', function(req, res){
  res.render("posts/new");
}); // new

app.post('/posts', function(req, res){
  Post.create(req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts');
  });
}); // create

app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", {data:post});
  });
}); // show

app.get('/posts/:id/edit', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/edit", {data:post});
  });
}); // edit

app.put('/posts/:id', function(req, res){
    req.body.post.updatedAt=Date.now();
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.redirect('/posts/'+req.params.id);
    });
  }); //update

  app.delete('/posts/:id', function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.redirect('/posts');
    });
  });  //delete
