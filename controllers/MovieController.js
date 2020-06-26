const { controller } = require('papis-controller')
const Movie = require('../models/MovieModel')
const auth = require('../middlewares/jwt')


/**
 * Movie List.
 */
exports.movieList = [
  auth,
  (req, res) => controller.List(req, res, Movie),
]

/**
 * Movie Detail.
 */
exports.movieDetail = [
  auth,
  (req, res) => { controller.Detail(req, res, Movie, '_id') },
]

/**
 * Movie store.
 */
exports.movieStore = [
  auth,
  (req, res) => { controller.Store(req, res, Movie, 'isan') },
]
/**
 * Movie update.
 */
exports.movieUpdate = [
  auth,
  (req, res) => { controller.Update(req, res, Movie, 'isan') },
]

/**
 * Movie Delete.
 */
exports.movieDelete = [
  auth,
  (req, res) => { controller.Delete(req, res, Movie) },
]
// ]
