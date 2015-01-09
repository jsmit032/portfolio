var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;

var CommentSchema = new Schema({

	body: 'String',
	author: 'String',
	upvotes: { type: Number, default: 0 },
	project: { type: Schema.Types.ObjectId, ref: 'project' }

});

module.exports = mongoose.model('Comment', CommentSchema);