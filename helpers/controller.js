const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const controller = require("../helpers/controller");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const { request } = require("chai");
const { query } = require("express");
mongoose.set("useFindAndModify", false);

exports.Liste = function (req, res, Objet) {
	try {
		Objet.find({user: req.user._id},"_id title description isbn createdAt").then((books)=>{
			if(books.length > 0){
				return apiResponse.successResponseWithData(res, "Operation success", books);
			}else{
				return apiResponse.notFoundResponse(res, "not found");
			}
		});
	} catch (err) {
		//throw error in json response with status 500. 
		return apiResponse.ErrorResponse(res, err);
	}
};

exports.Detail = function (req, res, Objet, attr){
	req.query
	console.log('tristan', req.params.id,req.params["id"], req.params)
	console.log(req.params[attr])
	if(!mongoose.Types.ObjectId.isValid(req.params[attr])){
		return apiResponse.successResponseWithData(res, "Operation success", {});
	}
	try {
		const query = {}
		query[attr]=req.params[attr]
		console.log('QUERY: ',query)
		Objet.findOne(query).then((book)=>{                
			if(book !== null){
				return apiResponse.successResponseWithData(res, "Operation success", book);
			}else{
				return apiResponse.notFoundResponse(res, "not found");
			}
		});
	} catch (err) {
		//throw error in json response with status 500. 
		return apiResponse.ErrorResponse(res, err);
	}
};