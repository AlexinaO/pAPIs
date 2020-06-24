// const { body, validationResult } = require('express-validator')
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

exports.paginate = (sourceList, page, perPage) => {
  const totalCount = sourceList.length
  const lastPage = Math.floor(totalCount / perPage)
  const sliceBegin = page * perPage
  const sliceEnd = sliceBegin + perPage
  const pageList = sourceList.slice(sliceBegin, sliceEnd)
  return {
    pageData: pageList,
    nextPage: page < lastPage ? page + 1 : null,
    totalCount,
  }
}
