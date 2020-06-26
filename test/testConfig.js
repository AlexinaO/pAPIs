// During the automated test the env variable, We will set it to "test"
process.env.NODE_ENV = 'test'
process.env.MONGODB_URL = 'mongodb://mongo:27017/rest-api-nodejs-mongodb-test'
process.env.JWT_SECRET = 'TESTSECRET'
process.env.JWT_TIMEOUT_DURATION = '2 hours'

// Require the dev-dependencies
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')

const should = chai.should()
chai.use(chaiHttp)

// Export this to use in multiple files
module.exports = {
  chai,
  server,
  should,
  faker,
}
