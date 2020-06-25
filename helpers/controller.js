const mongoose = require('mongoose')
const apiResponse = require('./apiResponse')

mongoose.set('useFindAndModify', false)

/**
 *
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @param {*} Objet Mongoose model
 */
exports.List = (req, res, Objet) => {
  try {
    Objet.find(req.query).then((books) => {
      if (books.length > 0) {
        return apiResponse.successResponseWithData(res, 'Operation success', books)
      }
      return apiResponse.notFoundResponse(res, 'not found')
    })
  } catch (err) {
    // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err)
  }
}

exports.Detail = (req, res, Objet, attr) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[attr])) {
    return apiResponse.successResponseWithData(res, 'Operation success', {})
  }
  try {
    const query = {}
    query[attr] = req.params[attr]
    Objet.findOne(query).then((book) => {
      if (book !== null) {
        return apiResponse.successResponseWithData(res, 'Operation success', book)
      }
      return apiResponse.notFoundResponse(res, 'not found')
    })
  } catch (err) {
    // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err)
  }
}
exports.Store = (req, res, Objet, Unique) => {
  const query = {}
  query[Unique] = req.body[Unique]
  Objet.findOne(query).then((objet) => {
    if (objet) {
      return Promise.reject('Objet already exist with this Unique no.')
    }
  })

  try {
    // Save objet.
    // eslint-disable-next-line no-new-object
    new Objet(Object.assign(req.body, { user: req.user })).save((err) => {
      if (err) { return apiResponse.validationErrorWithData(res, 'Validation error', err) }
      return apiResponse.successResponseWithData(res, 'Book add Success.')
    })
  } catch (err) {
  // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err)
  }
}
exports.Update = (req, res, Objet, Unique) => {
  const query = {}
  query[Unique] = req.body[Unique]
  Objet.findOne(query).then((objet) => {
    if (objet) {
      return Promise.reject('Objet already exist with this Unique no.')
    }
  })
  try {
    const objet = new Objet(Object.assign(req.body, { user: req.user }))
    Objet.findByIdAndUpdate(req.params.id, objet, (e) => {
      if (e) {
        return apiResponse.ErrorResponse(res, e)
      }
      return apiResponse.successResponseWithData(res, 'Book update Success')
    })
  } catch (err) {
  // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err)
  }
}
exports.Delete = (req, res, Objet) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, 'Invalid Error.', 'Invalid ID')
    }
    try {
      Objet.findById(req.params.id, (err, foundBook) => {
        if (foundBook === null) {
          return apiResponse.notFoundResponse(res, 'Book not exists with this id')
        }
        // Check authorized user
        if (foundBook.user.toString() !== req.user._id) {
          return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.')
        }
        // delete book.
        Objet.findByIdAndRemove(req.params.id, (e) => {
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
}
