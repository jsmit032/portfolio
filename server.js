var express 	= require('express'),
	app			= express(),
	port		= process.env.PORT || 3000,
	bodyParser	= require('body-parser'),
	mongoose  	= require('mongoose'),
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

//////////////////NEW PROJECT CONTROLLER ///////////////

///////////////////////////////////////////////////////

require('./server/routes.js')(app);

app.listen(port);

console.log('Server is running on port: ' + port);