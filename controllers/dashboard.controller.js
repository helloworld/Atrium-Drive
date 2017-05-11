let File = require("../models/file.model");
let User = require("../models/user.model");
let extension = require("file-extension");
let awsController = require('./aws.controller');
var hat = require("hat");
// -- Dashboard Controller -----------------------------------------------------
var S3_BUCKET = process.env.S3_BUCKET;

// -- GET /dashboard -----------------------------------------------------------
exports.index = function(req, res) {
	File.find({ user_id: req.user._id }, function(err, files) {
		if (err) throw err;
		res.render("dashboard", {
			title: "Atrium-Drive",
			files: files
		});
	});
};

// -- POST /dashboard/addFile --------------------------------------------------
exports.addFile = function(req, res) {
	let ext = extension(req.body.filename);
	let new_file = new File({
		filename: req.body.filename,
		filetype: ext,
		url: req.body.url,
		description: req.body.description,
		user_id: req.user._id
	});

	new_file.save(function(err) {
		if (err) throw err;
		res.json(new_file);
	});
};

// -- POST /dashboard/renameFile --------------------------------------------------
exports.editFile = function(req, res) {

    File.findOne({ _id: req.body._id }, function(err, file) {
        if (err) throw err;
        if (!file) {
            return res.send('No file found with id: ' + req.body.id);
        }

        if(file.filename == req.body.new_filename) {
        	return res.send(file.url);
        }

        awsController.copy(file.filename, req.body.new_filename, function() {
        	file.filename = req.body.new_filename;
        	file.description = req.body.new_description;
        	file.url = "https://s3.amazonaws.com/" +
                S3_BUCKET +
                "/" +
                req.body.new_filename;
        	file.save(function(err) {
        		if(err) throw err;
        		res.send(file.url);
        	})
        });
    });
};

// -- POST /dashboard/deleteFile --------------------------------------------------
exports.deleteFile = function(req, res) {
    File.findOneAndRemove({ _id: req.body._id }, function(err, file) {
        if (err) throw err;
        if (!file) {
            return res.send('No file found with id: ' + req.body.id);
        }
        awsController.delete(file.filename);
        res.send('200');
    });
};

// -- POST /dashboard/newToken --------------------------------------------------
exports.newToken = function(req, res) {
    User.findById(req.user.id, function(err, user) {
        var token = hat();
        user.api_token = token;
        user.save(function(err) {
            req.flash('success', {
                msg: 'New API Token has been generated'
            });
            res.redirect('/account');
        });
    });
}
