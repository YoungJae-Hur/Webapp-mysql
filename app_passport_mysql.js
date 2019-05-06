// This project uses mysql database system to store session information and user data. 
// To secure passwords, the encyption method, pbkdf2 is applied.
// With the passport library, this program uses the facebook federation authentication system.
// working date: 04-28-19
// URL: https://nodejs-features.run.goorm.io/auth/login
// routes are in the congig directory

var app = require('./config/mysql/express')();

var passport = require('./config/mysql/passport')(app);

app.get('/welcome', function(req, res){
	if(req.user && req.user.displayName){
		res.send(`
			<h1>Hello, ${req.user.displayName}</h1>
			<a href="/auth/logout">logout</a>
		`);
	}else{
		res.send(`
			<h1>Welcome</h1>
				<ul>
					<li><a href=/auth/login>Login</a></li>
					<li><a href=/auth/register>Register</a></li>
				</ul>
		`);
	}
});


var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

// connecting to port
app.listen(3000, function(){
	console.log('Connected, 3000 port!');
});

//this is just a temporary function
app.get('/tmp', function(req, res){
	res.send('result: ' + req.session.count);
});

