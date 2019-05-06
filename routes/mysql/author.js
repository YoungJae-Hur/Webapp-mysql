// this is a function for app_file.js 
module.exports = function(){
	var route = require('express').Router();
	var db = require('../../config/mysql/db2')();
	
	// showing author table 
	route.get('/', function(req, res){
		// console.log('----------/author---------');
		// console.log('Welcome!');
		// console.log('----------/author ended---------');
		var sql1 = 'select * from topic'; 
		db.query(sql1, function(err, files){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error(main):1');
			}
			// var title = req.params.title; // id is title 
			// //debug purpose 
			// console.log('Title: ' + title);
			// if(title == 'author'){
				var authorStr = 'SELECT * FROM author';
				db.query(authorStr, function(err, author){
					if (err){
						console.log(err);
						res.status(500).send('Internal Server Error(author in main):1');
					}
					res.render('topic/author', {topics:files, authors: author});
				});
			// }
		});
	});

	// create an author
	route.post('/create', function(req, res){
		var name = req.body.name; 
		var profile = req.body.profile;
		//console.log('----------/author/create---------');
		//console.log('Welcome!');
		//console.log('Name: ' + name); 
		//console.log('Profile: ' + profile);
		//console.log('----------/author/create ended---------');
		db.query('INSERT INTO author (name, profile) VALUES (?, ?)', [name, profile], function(err, result){ 
			if (err){
				console.log(err);
				res.status(500).send('Internal Server Error(author, create):1');
			}
			res.redirect('/author');
		});
	});

	// directing to updating an author's profile
	route.get('/update/:id', function(req, res){
		var id = req.params.id;
		console.log('----------/author/update/id---------');
		console.log('ID in update: ' + id);
		console.log('----------/author/update/id ended---------');
		db.query('SELECT * FROM topic', function (err, files){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error(author, update):1');
			}
			db.query('SELECT * FROM author',function (err, authors){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error(author, update):2');
				}
				db.query('SELECT name, profile FROM author WHERE id=?', [id], function (err, author){
					if(err){
						console.log(err);
						res.status(500).send('Internal Server Error(author, update):3');
					}
					res.render('topic/author_update', {topics:files, authors: authors, Uid:id, name:author[0].name, profile:author[0].profile});
				});
			});
		});
	});

	// updates an author's profile or name
	route.post('/update_process', function(req, res){
		var id = req.body.id; 
		var name = req.body.name; 
		var profile = req.body.profile; 
		//console.log('---------update_process------------');
		//console.log('id: ' + id);
		//console.log('name: ' + name);
		//console.log('profile: ' + profile);
		//console.log('---------update_process ended------------');
		db.query('UPDATE author SET name=?, profile=? WHERE id=?', [name, profile, id], function(err, result){
			if (err){
				console.log(err);
				res.status(500).send('Internal Server Error(author, update_process):1');
			}
			res.redirect('/author');
		});	
	});

	// deletes an author's info
	route.post('/delete', function(req, res){
		var id = req.body.id; 
		//var name = req.body.name; 
		//var profile = req.body.profile; 
		//console.log('---------delete------------');
		//console.log('id: ' + id);
		//console.log('name: ' + name);
		//console.log('profile: ' + profile);
		//console.log('---------delete ended------------');
		db.query('DELETE FROM author WHERE id=?', [id], function(err, result){
			if (err){
				console.log(err);
				res.status(500).send('Internal Server Error(author, delete):1');
			}
			res.redirect('/author');
		});	
	}); 
	return route;
};