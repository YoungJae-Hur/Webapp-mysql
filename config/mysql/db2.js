// this is for app_file.js database system
module.exports = function(){
	var mysql = require('mysql'); 

	//connecting to MySQL 
	var db = mysql.createConnection({
		host: 'localhost', 
		user: 'root',
		password: '111111',
		database: 'opentutorials'
	});
	db.connect();
	return db;
};
