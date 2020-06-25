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
  console.log('test99', query)
  Objet.findOne(query).then((objet) => {
    if (objet) {
      return Promise.reject('Objet already exist with this Unique no.')
    }
  })

  try {
    // Save objet.
    req.body.save((err) => {
    if (err) { return apiResponse.ErrorResponse(res, err) }
      return apiResponse.successResponseWithData(res, 'Book add Success.')
    })
  }
  catch (err) {
		      // throw error in json response with status 500.
		  return apiResponse.ErrorResponse(res, err)
  }
}
