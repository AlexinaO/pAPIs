// const { body, validationResult } = require('express-validator')
const mongoose = require('mongoose')
const apiResponse = require('./apiResponse')

mongoose.set('useFindAndModify', false)

exports.Liste = (req, res, Objet) => {
  try {
    Objet.find({ user: req.user._id }, '_id title description isbn createdAt').then((books) => {
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
//   req.query
  console.log('tristan', req.params.id, req.params.id, req.params)
  console.log(req.params[attr])
  if (!mongoose.Types.ObjectId.isValid(req.params[attr])) {
    return apiResponse.successResponseWithData(res, 'Operation success', {})
  }
  try {
    const query = {}
    query[attr] = req.params[attr]
    console.log('QUERY: ', query)
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
