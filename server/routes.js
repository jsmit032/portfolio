var Project 			= require('./models/project.js'),
	projectController 	= require('./controllers/projects-controller.js');

module.exports = function(app) {
	// Project routes
	app.get('/projects', projectController.getProject); 

	app.post('/projects', projectController.postProject);

	app.put('/projects/:id', projectController.updateProject);

	app.delete('/projects/:id', projectController.deleteProject);
    
    app.get('*', function(request, response) {
        response.render('index');
    });
};