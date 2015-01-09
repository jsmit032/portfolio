var Project 			= require('./models/project.js'),
	projectController 	= require('./controllers/projects-controller.js'),
	Comment				= require('./models/Comments.js');

module.exports = function(app) {
	// Project api routes
	app.get('/api/projects', projectController.getProject);  //index projects

	app.get('/api/projects/:id', projectController.showProject); //show project

	app.post('/api/projects', projectController.postProject); //create project

	app.put('/api/projects/:id', projectController.updateProject); //update project

	app.delete('/api/projects/:id', projectController.deleteProject); //delete project

	app.put('/api/projects/:id/upvote', projectController.upvoteProject); //uses upvote method from model to add votes

	//Project functionality 
	app.post('/', projectController.addProject);


    // Augular Page renders views/index.ejs
    app.get('*', function(request, response) {
        response.render('index');
    });
};