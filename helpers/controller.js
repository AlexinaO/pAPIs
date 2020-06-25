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
    Objet.find(req.query).then((objet) => {
      if (objet.length > 0) {
        return apiResponse.successResponseWithData(res, 'Operation success', objet)
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
    Objet.findOne(query).then((objet) => {
      if (objet !== null) {
        return apiResponse.successResponseWithData(res, 'Operation success', objet)
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
      return apiResponse.successResponseWithData(res, 'Objet add Success.')
    })
  } catch (err) {
    // throw error in json response with status 500.
    return apiResponse.ErrorResponse(res, err)
  }
}
exports.Update = (req, res, Objet, Unique) => {
  const query = {}
  query[Unique] = req.body[Unique]
  try {
    const objet = new Objet(Object.assign(req.body, { user: req.user }))
    Objet.findByIdAndUpdate(req.params.id, objet, (e) => {
      if (e) {
        return apiResponse.ErrorResponse(res, e)
      }
      return apiResponse.successResponseWithData(res, 'Objet update Success')
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
    Objet.findById(req.params.id, (err, foundObjet) => {
      if (foundObjet === null) {
        return apiResponse.notFoundResponse(res, 'Objet not exists with this id')
      }
      // Check authorized user
      if (foundObjet.user.toString() !== req.user._id) {
        return apiResponse.unauthorizedResponse(res, 'You are not authorized to do this operation.')
      }
      // delete.
      Objet.findByIdAndRemove(req.params.id, (e) => {
        if (e) {
          return apiResponse.ErrorResponse(res, e)
        }
        return apiResponse.successResponse(res, 'Objet delete Success.')
      })
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
