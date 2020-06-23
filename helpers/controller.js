const apiResponse = require("../helpers/apiResponse");

exports.Liste = function (req, res, Objet) {
	try {
		Objet.find({user: req.user._id},"_id title description isbn createdAt").then((books)=>{
			if(books.length > 0){
				return apiResponse.successResponseWithData(res, "Operation success", books);
			}else{
				return apiResponse.successResponseWithData(res, "Operation success", []);
			}
		});
	} catch (err) {
		//throw error in json response with status 500. 
		return apiResponse.ErrorResponse(res, err);
	}
};
