// This is router 
module.exports = function(passport){
	var route = require('express').Router();
	var bkfd2Password = require("pbkdf2-password");
	var db = require('../../config/mysql/db')();
	var hasher = bkfd2Password();
	route.post(
		'/login', 
		passport.authenticate(
			'local', 
			{
				successRedirect: '/topic',
				failureRedirect: '/auth/login',
				failureFlash: false 
			}
		)
	);

	// Redirect the user to Facebook for authentication.  When complete,
	// Facebook will redirect the user back to at : /auth/facebook/callback
	route.get('/facebook', passport.authenticate('facebook', {scope:'email'}));

	// Facebook will redirect the user to this URL after routeroval.  Finish the
	// authentication process by attempting to obtain an access token. 
	route.get('/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/topic',
										  failureRedirect: '/auth/login' }));
	// this is a function that registers 
	route.post('/register', function(req, res){
		hasher({password:req.body.password}, function(err, pass, salt, hash){
			var user = {
				authId: 'local:' + req.body.username,
				username:req.body.username,
				password:hash,
				salt:salt,
				displayName:req.body.displayName
			};
			var sql = 'INSERT INTO users SET ?';
			db.query(sql, user, function(err,results){
				if(err){
					console.log('error(1): /auth/register' + err);
					res.status(500);
				}else{
					req.login(user, function(err){ // register and immediately logged in status
						req.session.save(function(){
							res.redirect('/welcome');
						});
					});
					//req.session.displayName = req.body.displayName;
					//res.redirect('/welcome');
				}
			});

		});
	});
	route.get('/register', function(req, res){
		res.render('auth/register');
	});

	//login function
	route.get('/login', function(req, res){
		// var sql1 = 'SELECT * FROM topic'; 
		// db.query(sql1, function(err, topics, fields){
		// 	if(err){
		// 		console.log(err);
		// 		res.status(500).send('Internal Server Error(/login):1');
		// 	}
			res.render('auth/login');
		// });
	});

	// This is just a temp url for facebook developer private_policy setting
	route.get('/private_policy', function(req, res){
		res.send('This is private policy');
	});
	
	route.get('/logout', function(req, res){
		req.logout();
		//delete req.session.displayName;
		req.session.save(function(){
			res.redirect('/topic');
		});
	});
	return route;
};