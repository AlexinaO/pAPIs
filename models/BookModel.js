const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const { Schema } = mongoose

const BookSchema = new Schema({
  title: {
    type: String,
    minlength: 1,
    required: true,
  },
  description: {
    type: String,
    minlength: 1,
    required: true,
  },

  isbn: {
    type: String,
    minlength: 4,
    required: true,
  },

  user: {
    type: Schema.ObjectId,
    minlength: 1,
    ref: 'User',
    required: false,
  },

  author: {
    type: String,
    minlength: 1,
    required: true,
  },

  year: {
    type: Date,
    required: true,
  },
}, { timestamps: true, strict: true }).plugin(mongoosePaginate)

module.exports = mongoose.model('Book', BookSchema)
