/* eslint-disable no-mixed-spaces-and-tabs */
const { body, validationResult } = require('express-validator')
const mongoose = require('mongoose')
const Book = require('../models/BookModel')
const auth = require('../middlewares/jwt')
const controller = require('../helpers/controller')

const apiResponse = require('../helpers/apiResponse')


mongoose.set('useFindAndModify', false)

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
//   (req, res) => {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
//     }
//     try {
//       Book.findById(req.params.id, (err, foundBook) => {
//         if (foundBook === null) {
//           return apiResponse.notFoundResponse(res, 'Book not exists with this id')
//         }
//         // Check authorized user
//         if (foundBook.user.toString() !== req.user._id) {
//           return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.')
//         }
//         // delete book.
//         Book.findByIdAndRemove(req.params.id, (e) => {
//           if (e) {
//             return apiResponse.ErrorResponse(res, e)
//           }
//           return apiResponse.successResponse(res, 'Book delete Success.')
//         })
//       })
//     } catch (err) {
//       // throw error in json response with status 500.
//       return apiResponse.ErrorResponse(res, err)
//     }
//   },
// ]

exports.allBooks = [
  auth,
  (req, res) => {
    const page = parseInt(req.query.page) || 0
    const booksByPage = parseInt(req.query.booksByPage) || 5
    try {
      Book.paginate({}, { offset: page, limit: booksByPage })
	      .then((result) => {
          res.set('X-Total-Count', result.total)
          if (result.total > result.docs.length) {
            res.set('Link', `/all?page=${page + 1}`)
            return apiResponse.partialContent(res, 'Operation success', result.docs)
          } if (result.total === result.docs.length) {
            return apiResponse.successResponseWithData(res, 'Operation success', result.docs)
          }
          return apiResponse.notFoundResponse(res, 'Not found')
        })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  },
]
