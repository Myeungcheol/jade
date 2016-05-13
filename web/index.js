
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb://test:test@ds021462.mlab.com:21462/smart01");
var db = mongoose.connection;
db.once("open", function() {
  console.log("DB connected !");
});

db.on("error", function(){
  console.log("DB ERROR:", err);
});

app.set("view engine", 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

var data={count:0};

app.get('/', function(req, res){
  data.count++;
  res.render('index', data);
});

app.get('/reset', function(req, res){
  data.count=0;
  res.render('index', data);
})

app.get('/set/count', function(req, res){
  if(req.query.count) data.count = req.query.count;
  res.render('index', data);
});

app.get('/set/:num', function(req, res){
  data.count=req.params.num;
  res.render('index', data);
});

app.listen(2000, function(){
  console.log('Server On!');
});
