// require("dotenv").config();

//During the automated test the env variable, We will set it to "test"
process.env.NODE_ENV = "test";
process.env.MONGODB_URL = "mongodb://mongo:27017/rest-api-nodejs-mongodb-test";
process.env.JWT_SECRET="TESTSECRET";
process.env.JWT_TIMEOUT_DURATION="2 hours";
process.env.EMAIL_SMTP_HOST="in-v3.mailjet.com";
process.env.EMAIL_SMTP_PORT=587;
process.env.EMAIL_SMTP_SECURE=true;

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);

//Export this to use in multiple files
module.exports = {
	chai: chai,
	server: server,
	should: should
};