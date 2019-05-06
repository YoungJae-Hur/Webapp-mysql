// this is for the app_passport_mysql.js file 
module.exports = function(){
	// mysql library
	var mysql = require('mysql');
	var db = mysql.createConnection({
	  host: 'localhost', 
	  user: 'root',
	  password: '111111',
	  database: 'o2'
	});
	db.connect();
	return db;
};