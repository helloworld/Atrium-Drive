let File = require("../models/file.model");
let extension = require("file-extension");

// -- Dashboard Controller -----------------------------------------------------

// -- GET /dashboard -----------------------------------------------------------
exports.index = function(req, res) {
	File.find({ user_id: req.user._id }, function(err, files) {
		console.log(files);
		if (err) throw err;
		res.render("dashboard", {
			title: "Atrium-Drive",
			files: files
		});
	});
};

// -- POST /dashboard/addFile --------------------------------------------------
exports.addFile = function(req, res) {
	let new_file = new File({
		filename: req.body.filename,
		filetype: extension(req.body.filename),
		url: req.body.url,
		user_id: req.user._id
	});

	new_file.save(function(err) {
		if (err) throw err;
		res.json(new_file);
	});
};
