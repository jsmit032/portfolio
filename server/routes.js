var Project 			= require('./models/project.js'),
	projectController 	= require('./controllers/projects-controller.js'),
	Comment				= require('./models/Comments.js');

module.exports = function(app, smtpTransport) {
	// Project api routes
	app.get('/api/projects', projectController.getProject);  //index projects

	app.get('/api/projects/:id', projectController.showProject); //show project

	app.post('/api/projects', projectController.postProject); //create project

	app.put('/api/projects/:id', projectController.updateProject); //update project

	app.delete('/api/projects/:id', projectController.deleteProject); //delete project

	app.put('/api/projects/:id/upvote', projectController.upvoteProject); //uses upvote method from model to add votes

	//Project functionality 
	// app.post('/', projectController.addProject);


    // Augular Page renders views/index.ejs
    app.get('*', function(request, response) {
        response.render('index');
    });

    // Code for mailer functionality
    app.get('/', function(request, response){
    	response.sendfile('index.html');
    });

    app.post('/', function(request, response){
    	console.log("in mail controller");
    	var mailOptions = {
    		To: request.body.contact_email,
    		subject: request.body.subject,
    		text: request.body.message
    	}
    	console.log(mailOptions);
    	smtpTransport.sendMail(mailOptions, function(error, response){
    		if (error) {
    			console.log(error);
    		} else {
    			console.log("Message sent: " + response.message);
    			response.redirect('/');
    		}
    	})
    });
};