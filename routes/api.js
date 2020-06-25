const express = require('express')
const authRouter = require('./auth')
const bookRouter = require('./book')
const movieRouter = require('./movie')

const app = express()

app.use('/auth/', authRouter)
app.use('/book/', bookRouter)
app.use('/movie/', movieRouter)

module.exports = app
