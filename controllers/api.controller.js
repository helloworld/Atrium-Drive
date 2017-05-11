let File = require("../models/file.model");
let User = require('../models/user.model');
let awsController = require('./aws.controller');

// -- API Controller -----------------------------------------------------
function extract_key(req) {
	let API_KEY = req.headers.authorization;
	API_KEY = API_KEY.replace("Bearer ", "");
	return API_KEY;
}

// -- GET /api/list ------------------------------------------------------
exports.list = function(req, res) {
	
	req.checkHeaders('authorization', 'API_KEY authorization not provided').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
	    return res.json({
	        errors: errors
	    });
	}

	User.findOne({
	    api_token: extract_key(req)
	}, function(err, user) {
	    if (!user || !user.api_token) return res.json({
	        errors: "Invalid API_KEY"
	    });

	    File.find({ user_id: user._id }, function(err, files) {
	    	if (err) throw err;
	    	res.json(files);
	    });	
	});
}

// -- DELETE /api/delete/:_id ------------------------------------------------------
exports.delete = function(req, res) {
	
	req.checkHeaders('authorization', 'API_KEY authorization not provided').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
	    return res.json({
	        errors: errors
	    });
	}

	User.findOne({
	    api_token: extract_key(req)
	}, function(err, user) {
	    if (!user || !user.api_token) return res.json({
	        errors: "Invalid API_KEY"
	    });

	   File.findOneAndRemove({ user_id: user._id, _id: req.params._id }, function(err, file) {
	       if (err) throw err;
	       if (!file) {
	           return res.send('No file found with id: ' + req.params._id);
	       }
	       awsController.delete(file.filename);
	       res.send('File deleted');
	   });
	});
}

// -- PUT /api/update/_id ------------------------------------------------------
exports.delete = function(req, res) {
	
	req.checkHeaders('authorization', 'API_KEY authorization not provided').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
	    return res.json({
	        errors: errors
	    });
	}

	User.findOne({
	    api_token: extract_key(req)
	}, function(err, user) {
	    if (!user || !user.api_token) return res.json({
	        errors: "Invalid API_KEY"
	    });

	   File.findOneAndRemove({ user_id: user._id, _id: req.params._id }, function(err, file) {
	       if (err) throw err;
	       if (!file) {
	           return res.send('No file found with id: ' + req.params._id);
	       }
	       awsController.delete(file.filename);
	       res.send('File deleted');
	   });
	});
}