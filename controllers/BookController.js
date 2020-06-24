const { body, validationResult } = require('express-validator')
const mongoose = require('mongoose')
const Book = require('../models/BookModel')
const auth = require('../middlewares/jwt')
const controller = require('../helpers/controller')

const apiResponse = require('../helpers/apiResponse')

mongoose.set('useFindAndModify', false)

// Book Schema
function BookData(data) {
  this.id = data._id
  this.title = data.title
  this.description = data.description
  this.isbn = data.isbn
  this.createdAt = data.createdAt
}

/**
 * Book List.
 *
 * @returns {Object}
 */
exports.bookList = [
  auth,
  (req, res) => controller.List(req, res, Book),
]

/**
 * Book Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.bookDetail = [
  auth,
  (req, res) => { controller.Detail(req, res, Book, '_id') },
]

/**
 * Book store.
 *
 * @param {string}      title
 * @param {string}      description
 * @param {string}      isbn
 *
 * @returns {Object}
 */
exports.bookStore = [
  auth,
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
  body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim().custom((value, { req }) => Book.findOne({ isbn: value, user: req.user._id }).then((book) => {
    if (book) {
      return Promise.reject('Book already exist with this ISBN no.')
    }
  })),
  body('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const book = new Book({
        title: req.body.title,
        user: req.user,
        description: req.body.description,
        isbn: req.body.isbn,
        author: req.body.author,
        year: req.body.year,
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }

      // Save book.
      book.save((err) => {
        if (err) { return apiResponse.ErrorResponse(res, err) }
        const bookData = new BookData(book)
        return apiResponse.successResponseWithData(res, 'Book add Success.', bookData)
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  },
]

/**
 * Book update.
 *
 * @param {string}      title
 * @param {string}      description
 * @param {string}      isbn
 * @param {string}      author
 * @param {string}      year
 *
 * @returns {Object}
 */
exports.bookUpdate = [
  auth,
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
  body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim().custom((value, { req }) => Book.findOne({ isbn: value, user: req.user._id, _id: { $ne: req.params.id } }).then((book) => {
    if (book) {
      return Promise.reject('Book already exist with this ISBN no.')
    }
  })),
  body('*').escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      const book = new Book({
        title: req.body.title,
        description: req.body.description,
        isbn: req.body.isbn,
        author: req.body.author,
        year: req.body.year,
        _id: req.params.id,
      })

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
      }
      Book.findById(req.params.id, (err, foundBook) => {
        if (foundBook === null) {
          return apiResponse.notFoundResponse(res, 'Book not exists with this id')
        }
        // Check authorized user
        if (foundBook.user.toString() !== req.user._id) {
          return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.')
        }
        // update book.
        Book.findByIdAndUpdate(req.params.id, book, {}, (e) => {
          if (e) {
            return apiResponse.ErrorResponse(res, e)
          }
          const bookData = new BookData(book)
          return apiResponse.successResponseWithData(res, 'Book update Success.', bookData)
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  },
]

/**
 * Book Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.bookDelete = [
  auth,
  (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
    }
    try {
      Book.findById(req.params.id, (err, foundBook) => {
        if (foundBook === null) {
          return apiResponse.notFoundResponse(res, 'Book not exists with this id')
        }
        // Check authorized user
        if (foundBook.user.toString() !== req.user._id) {
          return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.')
        }
        // delete book.
        Book.findByIdAndRemove(req.params.id, (e) => {
          if (e) {
            return apiResponse.ErrorResponse(res, e)
          }
          return apiResponse.successResponse(res, 'Book delete Success.')
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  },
]

exports.allBooks = [
  auth,
  function (req, res) {
    const page = parseInt(req.query.page) || 0
    let booksByPage = parseInt(req.query.booksByPage) || 5

    try {
	  .sort({ update_at: -1 })
	  Book.find({}, '_id title description isbn createdAt')
	  .skip(page * booksByPage)
	  .limit(booksByPage)
	  .then((page) => {
        if (page.length > 0) {
		}
		  return apiResponse.partialContent(res, 'Operation success', page)
        return apiResponse.notFoundResponse(res, 'Not found')
		})
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
  },
    }
]