var Project 			= require('./models/project.js'),
	projectController 	= require('./controllers/projects-controller.js');

module.exports = function(app) {
	// Project api routes
	app.get('/projects', projectController.getProject); 

	app.post('/projects', projectController.postProject);

	app.put('/projects/:id', projectController.updateProject);

	app.delete('/projects/:id', projectController.deleteProject);

	//Project functionality 
	app.post('/', projectController.addProject);


    // Augular Page renders views/index.ejs
    app.get('*', function(request, response) {
        response.render('index');
    });
};