// This project uses mysql database system to store session information and user data. 
// To secure passwords, the encyption method, pbkdf2 is applied.
// With the passport library, this program uses the facebook federation authentication system.
// working date: 05-02-19
// URL: https://nodejs-features.run.goorm.io/auth/login
// routes are in the congig directory
/* homepage URL: https://nodejs-features.run.goorm.io/topic
** VIEW pages are in the views/mysql/topic directory + layout.jade
** Project starting date: 04-29-19 thru 05-02-19
** Routes are in the congig directory
*/
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql'); 
//var popupS = require('popups');
//var JSAlert = require("js-alert");

//connecting to MySQL 
var db = mysql.createConnection({
	host: 'localhost', 
	user: 'root',
	password: '111111',
	database: 'opentutorials'
});
db.connect();
var app = require('./config/mysql/express')();
//var app = express();

// connecting to port
app.listen(3000, function(){
	console.log('Connected, 3000 port!');
});

//Makes the html code pretty (= make a line)
//app.locals.pretty = true;

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

//declare template engines with express 
// app.set('views', './views/mysql');
// app.set('view engine', 'jade');


//auth+passport section
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

// topic section
var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

// author section
var author = require('./routes/mysql/author')();
app.use('/author', author);

// this is just a temp 
app.get('/bike', function(req, res){
	res.render('bike/bike');
});

// this is just a temp 
app.get('/coffee', function(req, res){
	res.render('coffee/coffee');
});
