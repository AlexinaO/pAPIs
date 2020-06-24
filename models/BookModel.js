const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const { Schema } = mongoose

const BookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  isbn: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: 'User', required: false },
  author: { type: String, required: true },
  year: { type: Date, required: true },
}, { timestamps: true }).plugin(mongoosePaginate)

module.exports = mongoose.model('Book', BookSchema)
