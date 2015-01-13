var express 	= require('express'),
	app			= express(),
	port		= process.env.PORT || 3000,
	bodyParser	= require('body-parser'),
	mongoose  	= require('mongoose'),
	nodemailer	= require('nodemailer'),
	wellknown	= require('nodemailer-wellknown'),
	database 	= require('./config/database');

mongoose.connect(database.url);

//Test for connection success
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function callback () {
	console.log('Successfully connected to MongoDB');
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

// Configuring our SMTP Server details
// Responsible for sending and recieveing email
var config = wellknown('Gmail');
var smtpTransport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		XOAuth2: {
			clientId: '{{client_ID}}',
			clientSecret: '{{client_secret}}',
			timeout: 3600
		}
	}
});

//////////////////NEW PROJECT CONTROLLER ///////////////

///////////////////////////////////////////////////////

require('./server/routes.js')(app, smtpTransport);

app.listen(port);

console.log('Server is running on port: ' + port);