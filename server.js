var express 	= require('express'),
	app			= express(),
	port		= process.env.PORT || 3000,
	bodyParser	= require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

///////////////////////////////////////////////////////
var router  = express.Router();

app.get('*', function(request, response){
	response.render('index');
});

app.use('/', router);
///////////////////////////////////////////////////////

require('./server/routes.js')(app);

app.listen(port);

console.log('Server is running on port: ' + port);