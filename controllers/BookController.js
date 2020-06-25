const mongoose = require('mongoose')
const Book = require('../models/BookModel')
const auth = require('../middlewares/jwt')
const controller = require('../helpers/controller')

/**
 * Book List.
 */
exports.bookList = [
  auth,
  (req, res) => controller.List(req, res, Book),
]

/**
 * Book Detail.
 */
exports.bookDetail = [
  auth,
  (req, res) => { controller.Detail(req, res, Book, '_id') },
]

/**
 * Book store.
 */
exports.bookStore = [
  auth,
  (req, res) => { controller.Store(req, res, Book, 'isbn') },
]
/**
 * Book update.
 */
exports.bookUpdate = [
  auth,
  (req, res) => { controller.Update(req, res, Book, 'isbn') },
]

/**
 * Book Delete.
 */
exports.bookDelete = [
  auth,
  (req, res) => { controller.Delete(req, res, Book) },
]
// ]
