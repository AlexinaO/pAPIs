const express = require('express')
const MovieController = require('../controllers/MovieController')

const router = express.Router()

router.get('/', MovieController.movieList)
router.get('/:id', MovieController.movieDetail)
router.post('/', MovieController.movieStore)
router.put('/:id', MovieController.movieUpdate)
router.delete('/:id', MovieController.movieDelete)
router.get('/title/:title', MovieController.movieDetail)

module.exports = router
