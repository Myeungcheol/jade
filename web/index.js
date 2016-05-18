var express = require('express');  //express
var path = require('path'); //set path
var app = express();
var mongoose = require('mongoose'); //mongodb connector
var bodyParser = require('body-parser'); //http : post data paser(body)
var methodOverride = require('method-override'); // override delete method

var jquery = require('jquery');
// var bootstrap = require('bootstrap');

var jsdom = require('jsdom');
// var window = jsdom.jsdom().createWindow();
// var $ = require('jquery')(window);

//video controll
// var vidStreamer = require("vid-streamer");

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');


//db connection
mongoose.connect("mongodb://test:test@ds021462.mlab.com:21462/smart01");
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected !");
});

db.on("error", function(){
  console.log("DB ERROR:", err);
});

//video paly
  // app.get('/videos/', vidStreamer);

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

var itemSchema = mongoose.Schema({
  title: {type:String, required:true},
  path: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});


  var userSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  createAt:{type:Date, default:Date.now}
});




//create Model  --> collection name : post // for Schema : postSchema
var Post = mongoose.model('post', postSchema);
var Item = mongoose.model('item', itemSchema);
var User = mongoose.model('user', userSchema);

// linking
app.use(flash());
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); //recive
app.use(bodyParser.urlencoded({extended:true})); //send
app.use(methodOverride("_method")); // delete sign override
app.use(session({secret:"MySecret"}));
app.use(passport.initialize());
app.use(passport.session());

//serializeUser 는 session 생성시에 어떠한 정보를 저장할지를 설정
//현재 user 개체를 넘겨받아 user.id 를 session 에 저장
//이때 id는 username 이 아니라 db 의 id 이다
passport.serializeUser(function(user, done){
  done(null, user.id);
});

//deserializeUser는 session으로 부터 개체를 가져올때 어떻게 가져올지를 설정
//현재 id를 넘겨받아 DB 에서 user를 찾고 user를 가져옴
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err, user);
  });
});

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
  //setting - end

  app.get('/posts/item', function(req, res){
    res.render("posts/item");
  }); // new

  app.post('/posts/list', function(req, res){
    Item.create(req.body.item, function(err, item){
      if(err) return res.json({success:false, message:err});
      res.redirect('/posts/list');
    });
  }); // create

  app.get('/posts/list', function(req, res){
    Item.find({}).sort('-createdAt').exec(function(err, posts){
      if(err) return res.json({success:false, message:err});
      res.render("posts/list", {data:posts});
    });
  }); // list

  app.get('/posts/list/:id', function(req, res){
    Item.findById(req.params.id, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.render("posts/show_item", {data:post});
    });
  }); // show

  app.get('/posts/list/:id/edit', function(req, res){
    Item.findById(req.params.id, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.render("posts/edit_item", {data:post});
    });
  }); // edit

  app.put('/posts/list/:id', function(req, res){
      req.body.item.updatedAt=Date.now();
      Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, post){
        if(err) return res.json({success:false, message:err});
        res.redirect('/posts/list/'+req.params.id);
      });
    }); //update

  app.delete('/posts/list/:id', function(req, res){
    Item.findByIdAndRemove(req.params.id, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.redirect('/posts/list');
    });
  });  //delete
//list -end

//set route
// app.get('/posts', function(req, res){
//   Post.find({}).sort('-createdAt').exec(function(err, posts){
//     if(err) return res.json({success:false, message:err});
//     res.render("posts/index", {data:posts});
//   });
// }); // index

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




//인증방식설정(strategy)
var LocalStrategy = require('passport-local').Strategy;
passport.use('local-login',
  new LocalStrategy({
    usernameField : 'name',
    passwordField : 'password',
    passReqToCallback : true
  },
function(req, name, password, done){
  User.findOne({'name':name},function(err,user){
    if(err) return done(err);

    if(!user){
      req.flash("name", req.body.name);
      return done(null,false,req.flash('loginError', 'No user found'));
    }
    if(user.password != password){
      req.flash("name",req.body.name);
      return done(null, false, req.flash('loginError','Password does not Match.'));

    }
    return done(null,user);
  });
}
)
);

app.get('/',function(req,res){
  res.render('login/login',{name:req.flash("name")[0], loginError:req.flash('loginError')});
});

app.post('/login',
  function(req,res,next){
    req.flash("name");
    if(req.body.name.length === 0 || req.body.password.length === 0){
      req.flash("name", req.body.name);
      req.flash("loginError", "Please enter both name and password");
      res.redirect('/');
    }else{
      next();
    }
  }, passport.authenticate('local-login',{
    successRedirect : '/posts',
    failureRedirect : '/',
    failureFlash : true
  })
);

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

app.get('/users/new', function(req,res){
  res.render('users/new',{
    formData: req.flash('formData')[0],
    nameError: req.flash('nameError')[0],
    passwordError: req.flash('passwordError')[0],
  }
);
});

//유저를 직접 생성
//form에 입력된 name이 겹치는지 아닌지를 알려주는 함수

app.post('/users', checkUserReValidation, function(req,res,next){
  User.create(req.body.user, function(err,user){
    if(err) return res.json({success:false, message:err});
    res.redirect('/');
  });
});

//유저의 profile 을 보여주기 위한 route
//현재는 아이디만 알면 누구의 정보라도 볼수 있게 되어있다
app.get('/users/:id', function(req,res){
  User.findById(req.params.id, function(err,user){
    if(err) return res.json({success:false, message:err});
    res.render("users/show",{user:user});
  });
});

//유저 정보수정 form을 보여주는 route
app.get('/users/:id/edit', function(req,res){
  User.findById(req.params.id, function(err,user){
    if(err) return res.json({success:false, message:err});
  res.render('users/edit',{
    user : user,
    formData: req.flash('formData')[0],
    nameError: req.flash('nameError')[0],
    passwordError: req.flash('passwordError')[0],
  }
);
});
});

//업데이트 할 정보가 유효한지를 판단
//정보 업데이트를 실행하기 전에 우선 비밀번호가 맞는지를 확인
//새로운 비밀번호를 입력한 경우에 model의 비밀번호를 교체하고 그렇지 않은 경우에는
//모델에서 비밀번호를 빼버림
//게시판 시작페이지에서 로그인이 되어 있는 경우 "profile", "logout" 버튼을 보여주고,
//로그인이 되어 있지 않은 경우 "login", "sign up" 버튼을 보여줄텐데,
//이러기 위해서는 시작페이지로 req.user를 보내서 view에서 로그인이 되어있는지 아닌지를 알 수 있게 해야 합니다.
//(req.user는 passport package에서 생성하는 개체로, session이 생성될때(로그인할때) 자동 생성되는 개체라는것 기억하시죠?)
//게시판의 시작페이지, 즉 index에 user를 전달합니다.
app.put('/users/:id', checkUserReValidation, function(req,res){
  User.findById(req.params.id, req.body.user, function(err, user){
    if(err) return res.json({success:"false", message:err});
    if(req.body.user.password == user.password){
      if(req.body.user.newPassword){
        req.body.user.password = req.body.user.newPassword;
      }else{
        delete req.body.user.password;
      }
      User.findByIdAndUpdate(req.params.id, req.body.user, function(err,user){
        if(err) return res.json({success:"false", message:err});
        res.redirect('/users/'+req.params.id);
      });
    }else{
      req.flash("formData",req.body.user);
      req.flash("passwordError","- Invalid password");
      res.redirect('/users/'+req.params.id+"/edit");
    }
  });
});

app.get('/posts', function(req, res){
  Post.find({}).sort('-createAt').exec(function(err,posts){
    if(err) return res.json({success:false,message:err});
    res.render("posts/index", {data:posts, user:req.user});
  });
});

function checkUserReValidation(req, res, next){
  var isValid = true;

  async.waterfall(
    [function(calback){
      User.findOne({name: req.body.user.name, _id:{$ne: mongoose.Types.ObjectId(req.params.id)}},
        function(err, user){
          if(user){
            isValid = false;
            req.flash("nameError","- This name is already resistered.");
          }
          calback(null, isValid);
        }
    );
  }], function(err, isValid){
    if(err) return res.json({success:"false", message:err});
    if(isValid){
      return next();
    }else{
      req.flash("formData", req.body.user);
      res.redirect("back");
    }
  }
);
}
