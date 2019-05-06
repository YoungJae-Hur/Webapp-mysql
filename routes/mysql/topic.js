// this function take care of all /topic routine. 
module.exports = function(){
	var route = require('express').Router();
	var db = require('../../config/mysql/db2')();
	
	// creates a new title
	route.get('/add', function(req, res){
		var str_Topic = 'select * from topic';
		db.query(str_Topic, function(err, topics){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error(/add):1');
			}
			var str_Author = 'select * from author';
			db.query(str_Author, function(err, authors){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error(/add):2');
				}
				// dubug purpose
				//console.log(authors);
				res.render('topic/add', {topics:topics, authors:authors, user:req.user});
			});
		});
	});

	//A method that creates a post (insertion)
	route.post('/', function(req, res){
		var title = req.body.title;
		var description = req.body.description; 
		var author = req.body.author;
		//debug
		console.log('Author: '+author);
		
		var insertStr = 'INSERT INTO topic (title, description, created, author_id) VALUES (?,?,NOW(),?)';
		db.query(insertStr,[title, description, author], function(err, result){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error(home):1');
			}
			res.redirect('/topic/'+title);
		});
	}); 


	// moves to updating the contents of a title 
	route.get('/update/:title', function(req, res){
		var sql = 'select * from topic'; 
		db.query(sql, function(err, files){
			if(err){
				console.log(err); 
				res.status(500).send('Internal Server Error(/update):1');
			}
			var sql2 = 'SELECT * FROM author';
			db.query(sql2, function(err, authors){
				if(err){
					console.log(err); 
					res.status(500).send('Internal Server Error(/update):2');
				}
				var title = req.params.title; // id is title 
				var Uid = 0;
				var desc = '';
				var author_Id = 0; 
				var sql3 = 'SELECT id, description, author_id FROM topic WHERE title=?';
				db.query(sql3, [title], function(err, data){
					if(err){
						console.log(err); 
						res.status(500).send('Internal Server Error(/update):3');
					}
					Uid = data[0].id;
					desc = data[0].description;
					author_Id = data[0].author_id;
					res.render('topic/update', {topics:files, id:Uid, title:title, description:desc, authors:authors, author_id:author_Id, user:req.user});
				});
			});	
		});
	});

	// updates db with info from user 
	route.post('/update/:id', function(req, res){
		var id = req.body.id;
		var updatedTitle = req.body.title; 
		var updatedDes = req.body.description;
		var authorId = req.body.authorId; 
		console.log('-----------------update---------------');
		console.log('Id: ' + id); 
		console.log('updatedTitle: ' + updatedTitle); 
		console.log('updatedDes: ' + updatedDes);
		console.log('authorId: ' + authorId);
		console.log('-----------------update end---------------');
		var str = 'UPDATE topic SET title=?, description=?, created=NOW(), author_id=? WHERE id=?'; 
		db.query(str, [updatedTitle, updatedDes, authorId,id], function(err, result){
			if (err){
				console.log(err); 
				res.status(500).send('Internal Server Error(/update):1');
			}
			res.redirect('/topic/' + updatedTitle);
		});
	});


	// Deletes a topic 
	route.post('/delete/:title', function(req, res){
		var title = req.params.title;
		var str = 'SELECT id FROM topic WHERE title=?';
		db.query(str, [title], function(err, result){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error(/delete):1');
			}
			var id = result[0].id;
			var str = 'DELETE FROM topic WHERE id=?';
			db.query(str, [id], function(err, data){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error(/delete):2');
				}
				// debug purpose
				console.log('ID: '+id+', Title: '+title+' is successfully  deleted!');
				res.redirect('/topic');
			});
		});
	});

	// main
	route.get(['/', '/:title'], function(req, res){
		var sql1 = 'select * from topic'; 
		db.query(sql1, function(err, files){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error(main):1');
			}
			var title = req.params.title; // title 
			//debug purpose 
			console.log('Title: ' + title);

			 if(typeof title != 'undefined'){
			   // when id exists
				var idStr = 'SELECT id FROM topic WHERE title=?';
				db.query(idStr, [title], function(err, idResult){
					if(err){
						console.log(err);
						res.status(500).send('Internal Server Error(main):2');
					}
					var id = idResult[0].id;
					console.log('Id num: '+id);
					var sql2 = 'SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?'; 
					db.query(sql2,[id],function(err, data){
						if(err){
							console.log(err);
							res.status(500).send('Internal Server Error(main):3');
						}
						//debug purpose
						//console.log(data);
						console.log('Description: ' + data[0].description);
						res.render('topic/view_title', {topics:files, title:title, description:data[0].description, name:data[0].name, user:req.user});
					});
				});
			}else{
				if (title == 'undefined'){
					res.redirect('/author');
				}
			   // when id does not exists
			   res.render('topic/view', {topics:files, title:'Welcome!', description:'Hello, this is javascript server', user:req.user});	
			}
		});
	});
	
	return route;
};
