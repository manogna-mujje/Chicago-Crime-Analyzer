var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var index = require('./routes/index');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');

mongoose.connect('mongodb://localhost:27017/crimes', {useNewUrlParser: true}, function(err){
  if(err) throw err;
  console.log("sucessfully connected");
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/', index);
//app.use('/laws',index);

app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});