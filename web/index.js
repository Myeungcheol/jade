
var express = require('express');
var path = require('path');
var app = express();

app.set("view engine", 'ejs');
//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index');
});

app.listen(2000, function(){
  console.log('Server On!');
});
