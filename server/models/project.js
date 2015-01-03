var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;

var ProjectSchema = new Schema({

	projectname: 'String',
	projectlink: 'String',
	projectimage: 'String'

});

module.exports = mongoose.model('Project', ProjectSchema);