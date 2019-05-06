
module.exports = function(app){
	var db = require('./db')();
	var bkfd2Password = require("pbkdf2-password");
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var FacebookStrategy = require('passport-facebook').Strategy;
	var hasher = bkfd2Password();

	// for passport inti
	app.use(passport.initialize());
	app.use(passport.session()); // has to be located after session init function above^
	
	passport.serializeUser(function(user, done) { //세션에 등록 
	  console.log('serializeUser: ', user);
	  done(null, user.authId); // 두번째 인자는 user 테이블의 username 값을 준다.
	});

	passport.deserializeUser(function(id, done) {
	  console.log('deserializeUser: ', id);
		var sql = 'SELECT * FROM users WHERE authId=?';
		db.query(sql, [id], function(err, results){
			if(err){
				console.log('error(1): deserializeUser' + err);
				done('There is no user.');
			}else{
				done(null, results[0]);
			}
		});
	});

	passport.use(new LocalStrategy(
		function(username, password, done){
			var uname = username; 
			var pwd = password;
			var sql = 'SELECT * FROM users WHERE authId=?';
			db.query(sql, ['local:'+uname], function(err, results){
				console.log(results);
				if (err){
					return done('There is no user.');
				}
				var user = results[0];
				return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
					// debug purpose
					//console.log('username: ' + uname + ' pass: '+ pass + ' hash: ' + hash);
					if(hash === user.password){
						console.log('LocalStrategy: ', user);
						done(null, user); // login process is suceeded
					}else{
						done(null, false, {message: 'Incorrect username'}); //login process is failed 
					}
				});
			});
		}
	));

	passport.use(new FacebookStrategy({
		clientID: '455791268323359',
		clientSecret: '27458f28234c79e77f803f05f0d62ad1',
		callbackURL: "https://nodejs-features.run.goorm.io/auth/facebook/callback", //'/auth/facebook/callback' 
		profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
	  },
	  function(accessToken, refreshToken, profile, done) {
		console.log('profile: ', profile);
		var authId = 'facebook:'+profile.id;

		var sql = 'SELECT * FROM users WHERE authId=?';
		db.query(sql, [authId], function(err, results){
			if(results.length>0){
				done(null, results[0]);
			}else{
				var newuser= {
					'authId':authId,
					'displayName':profile.displayName,
					'email': profile.emails[0].value
				};
				var sql = 'INSERT INTO users SET ?';
				db.query(sql, newuser, function(err, results){
					if(err){
						console.log('error(1): FacebookStrategy' + err);
						done('Error!');
					}else{
						done(null, newuser);
					}
				});
			}
		});
	  }
	));
	
	return passport;
};