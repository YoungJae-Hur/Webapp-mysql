
module.exports = function(){
	var express = require('express');
	var session = require('express-session');
	var MySQLStore = require('express-mysql-session')(session);
	var bodyParser = require('body-parser');

	var app = express();

	//declare template engines with express 
	app.set('views', './views/mysql');
	app.set('view engine', 'jade');

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }));

	// session init
	app.use(session({
	  secret: 'asdf!@$##$%^1234',
	  resave: false,
	  saveUninitialized: true,
	  store: new MySQLStore({
			host: 'localhost',
			port: 3306,
			user: 'root',
			password: '111111',
			database: 'o2'
	  }) // creates mysql db session
	}));
	return app;
};