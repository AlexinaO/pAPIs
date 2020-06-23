const mongoose = require('mongoose');

const { Schema } = mongoose;

var BookSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	isbn: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
	author: {type: String, required:true},
	year: {type: Date, required:true}
}, {timestamps: true});

module.exports = mongoose.model('Book', BookSchema);
