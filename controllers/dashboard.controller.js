let File = require("../models/file.model");
let extension = require("file-extension");
let awsController = require('./aws.controller');
// -- Dashboard Controller -----------------------------------------------------

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
