var Project  	= require('../models/project.js');

function getProject (request, response) {

	Project.find(function(error, data){
		if (error) console.log(error);
		response.status(200).json(data);
	})

}

function postProject (request, response) {

	var project = new Project();

	project.name = request.body.name;
	project.link = request.body.link;

	project.save(function(error){
		if (error) console.log(error);
		response.status(201).json({ message: 'project was created successfully!' });
	});

}

function updateProject (request, response) {

	Project.findById(request.params.id,
		function(error, project){
			if (error) console.log(error);
			project.name = request.body.name;
			project.link = request.body.link;

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

};

module.exports = {

	getProject: getProject,
	postProject: postProject,
	updateProject: updateProject,
	deleteProject: deleteProject

}