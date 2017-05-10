let File = require("../models/file.model");
let extension = require("file-extension");

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

var extension_icon_map = {
	"txt": "file text", 
	"zip": "file archive outline", 
	"doc":  "file word outline",
	"docx": "file word outline",
	"ppt": "file powerpoint outline",
	"pptx": "file powerpoint outline",
}

exports.addFile = function(req, res) {
	let ext = extension(req.body.filename);
	let icon = extension_icon_map[ext] ? extension_icon_map[ext] : "file outline";
	let new_file = new File({
		filename: req.body.filename,
		filetype: ext,
		icon: icon,
		url: req.body.url,
		user_id: req.user._id
	});

	new_file.save(function(err) {
		if (err) throw err;
		res.json(new_file);
	});
};
