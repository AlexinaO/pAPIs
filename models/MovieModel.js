const mongoose = require('mongoose')

const { Schema } = mongoose

const MovieSchema = new Schema({
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

  isan: {
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
}, { timestamps: true, strict: true })

module.exports = mongoose.model('Movie', MovieSchema)
