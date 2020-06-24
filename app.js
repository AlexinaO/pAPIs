const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const indexRouter = require('./routes/index')
const apiRouter = require('./routes/api')
const apiResponse = require('./helpers/apiResponse')

// DB connection
const { MONGODB_URL } = process.env

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  // don't show the log when it is test
  if (process.env.NODE_ENV !== 'test') {
    console.log('Connected to %s', MONGODB_URL)
    console.log('App is running ... \n')
    console.log('Press CTRL + C to stop the process. \n')
  }
})
  .catch((err) => {
    console.error('App starting error:', err.message)
    process.exit(1)
  })
// eslint-disable-next-line no-unused-vars
const db = mongoose.connection

const app = express()

// display swagger in test env
if (process.env.NODE_ENV === 'test') {
  const swaggerUi = require('swagger-ui-express')
  const swaggerDocument = require('./swagger.json')

  app.use(logger('dev'))
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// To allow cross-origin requests
app.use(cors())

// Route Prefixes
app.use('/', indexRouter)
app.use('/api/', apiRouter)

// throw 404 if URL not found
app.all('*', (req, res) => apiResponse.notFoundResponse(res, 'Page not found'))

// eslint-disable-next-line consistent-return
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    return apiResponse.unauthorizedResponse(res, err.message)
  }
})

module.exports = app
