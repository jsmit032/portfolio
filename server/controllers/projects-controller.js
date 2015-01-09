var Project  	= require('../models/project.js');

function getProject (request, response) {

	Project.find(function(error, data){
		if (error) console.log(error);
		response.json(data);
	})

}

function showProject (request, response) {

	Project.findById(request.params.id,
		function(error, project){

			if (error) console.log(error);
			response.status(200).json(project);

		}
	);

}

function upvoteProject (request, response, next) {

	Project.findById(request.params.id, function(error, project){
		if (error) { return next(error); }

		project.upvote(function(error, project){
			if (error) console.log('project was unable to upvote');
			response.status(202).json({ message: 'project successfully upvoted!' });
		});
	});

}

function postProject (request, response) {

	var project = new Project();

	project.projectname = request.body.projectname;
	project.projectlink = request.body.projectlink;

	project.save(function(error){
		if (error) console.log(error);
		response.status(201).json({ message: 'project was created successfully!' });
	});

}

function updateProject (request, response) {

	Project.findById(request.params.id,
		function(error, project){
			if (error) console.log(error);
			project.projectname = request.body.projectname;
			project.projectlink = request.body.projectlink;

			project.save(function(error){
				response.status(202).json({ message: 'project was successfully updated!' });
			})
		}
	);

}

function deleteProject (request, response) {

	Project.remove({ _id: request.params.id }, 
		function(error, data){
			if (error) console.log(error);
			response.status(202).json({ message: 'project successfully deleted!' });
		}
	);

}

function addProject (request, response) {

	console.log('in the signup controller');
	console.log(request.body.projectname);
	console.log(request.body.projectlink);

	var newProject = new Project();

	newProject.projectname = request.body.projectname;
	newProject.projectlink = request.body.projectlink;

	newProject.save(function(error){
		if (error) console.log('Unable to save new project b/c: ', error);
		console.log('Project Saved!');
		console.log(newProject);
	});

	response.redirect('/');

};

module.exports = {

	getProject: getProject,
	showProject: showProject,
	upvoteProject: upvoteProject,
	postProject: postProject,
	updateProject: updateProject,
	deleteProject: deleteProject,
	addProject: addProject

}