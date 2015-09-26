var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/../public'));
 app.get('/', function(req, res){
   res.render('index', {currentTemp: '211', idealTemp: '250'});
 });

 var server = app.listen(3000);
