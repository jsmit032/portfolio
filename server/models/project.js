var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;

// orginal creation used for node.js form on home.html

// var ProjectSchema = new Schema({

// 	projectname: 'String',
// 	projectlink: 'String'

// });

var ProjectSchema = new Schema({

	projectname: 'String',
	projectlink: 'String',
	upvotes: { type: Number, default: 0 },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]

});

ProjectSchema.methods.upvote = function(cb) {

	this.upvotes += 1;
	this.save(cb);

};

module.exports = mongoose.model('Project', ProjectSchema);