const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')
// helper file to prepare responses.
const apiResponse = require('../helpers/apiResponse')

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
  // Validate fields.
  body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.')
    .escape(),
  body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
    .isAlphanumeric()
    .withMessage('Last name has non-alphanumeric characters.')
    .escape(),
  body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .escape()
    .normalizeEmail()
    .custom((value) => UserModel.findOne({ email: value }).then((user) => {
      if (user) { return Promise.reject('E-mail already in use') }
    })),
  body('password').isLength({ min: 6 }).trim().withMessage('Password must be 6 characters or greater.')
    .escape(),
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      // hash input password
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        // Create User object with escaped and trimmed data
        const user = new UserModel({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
        })

        // Save user.
        user.save((e) => {
          if (e) { return apiResponse.ErrorResponse(res, e) }
          const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
          return apiResponse.successResponseWithData(res, 'Registration Success.', userData)
        })
      })
    } catch (err) {
      // throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err)
    }
  }]

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
  body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .escape(),
  body('password').isLength({ min: 1 }).trim().withMessage('Password must be specified.')
    .escape(),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array())
      }
      UserModel.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return apiResponse.unauthorizedResponse(res, 'Email or Password wrong.')
        }
        // Compare given password with db's hash.
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          if (!same) {
            return apiResponse.unauthorizedResponse(res, 'Email or Password wrong.')
          }
          if (!user.status) {
            return apiResponse.unauthorizedResponse(res, 'Account is not active. Please contact admin.')
          }
          const userData = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }
          // Prepare JWT token for authentication
          const jwtPayload = userData
          const jwtData = {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
          }
          const secret = process.env.JWT_SECRET
          // Generated JWT token with Payload and secret.
          userData.token = jwt.sign(jwtPayload, secret, jwtData)
          return apiResponse.successResponseWithData(res, 'Login Success.', userData)
        })
      })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err)
    }
  }]
