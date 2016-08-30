var db = require('./db/index.js');
var router = require('express').Router();

//Connect controller methods to their corresponding routes
var Projects = require ('./collections/projects.js')
var Pledges = require ('./collections/pledges.js')
var Users = require ('./collections/users.js')

router.get('/projects', function (req, res) {
	Projects.reset().fetch()
		.then(function(projects) {
			// console.log("project models:",projects.models)
			res.send(projects.models)
		});

	console.log("succesful get:");//, db.knex.select("name").from("Projects"));
});


router.get('/projects:projectName', function (req, res) {

	Projects.model.where({"name":projectName}).fetch().then(function(project){
		res.send(project);
	})
});

router.get('/users', function (req, res) {
	Users.reset().fetch()
		.then(function(users) {
			console.log("user Models", users.models)
			res.send(users.models)
		});

	console.log("succesful get:");//, db.knex.select("name").from("Projects"));
});

router.get('/keywords', function (req, res) {
	Keywords.reset().fetch()
		.then(function(keywords) {
			console.log("keywords models:", keywords.models)
			res.send(keywords.models)
		});

	console.log("succesful get:");//, db.knex.select("name").from("Projects"));
});

/*
{
	username:[string],
	email:[string], //do we need this??????
	projectName:[string],
	timeConstraint: [int],
	wanted: [string],
	description: [string],
	pledge:[int]
}
*/

router.post('/project', function (req, res) {
	console.log("succesful post to project", req.body.timeConstraint);
	Projects.create({
		name: req.body.projectName,
		// timeConstraint: req.body.timeConstraint,
		wanted: req.body.wanted,
		description: req.body.description
	});
	console.log("projectcreated")

	Projects.model.where({"name":req.body.projectName}).fetch().then(function(project){
		Users.model.where({"username":req.body.username}).fetch().then(function(user){

			Pledges.create({
				user_id: user.attributes.id,
				project_id: project.attributes.id,
				amount: req.body.pledge
			});

			console.log( project);

			res.send(req.body);
		});
	});
});


/*
{
	username:[string],
	email:[string]
}
*/
router.post('/users', function (req, res) {
	console.log("succesful post to users", req.body);
	db.knex('Users').insert({
		"email": req.body.email,
		"username": req.body.username
	}).then(function(data){
		console.log(data);
	})
	// new Users.model ({
	// 	email: req.body.email,
	// 	username: req.body.username
	// }).save().then(function(){

		res.send(req.body);
	// });
});

router.post('/keywords', function (req, res) {
	console.log("succesful post to keywords", req.body);
	Keywords.create({
		user_id: req.body.word
	})

	res.send(req.body);
});

/*
{
	username: [string],
	project:[string],
	amount:[int]
}
*/
router.post('/pledges', function (req, res) {
	console.log("succesful post to pledges", req.body);

	Projects.model.where({"name":req.body.project}).fetch().then(function(project){

		Users.model.where({"username":req.body.username}).fetch().then(function(user){

			Pledges.create({
				user_id: user.attributes.id,
				project_id: project.attributes.id,
				amount: req.body.amount
			});

			console.log( project);

			res.send(req.body);
		});
	});
});


//do we even need a get pledges function?
router.get('/pledges', function(req,res){

})


module.exports = router;
