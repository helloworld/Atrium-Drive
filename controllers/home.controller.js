// -- Home Controller ----------------------------------------------------------

// GET /
exports.index = function(req, res) {
	if (req.user) {
        return res.redirect("/dashboard");
    }
    res.render('home', {
        title: 'Atrium-Drive'
    });
};

// GET /terms
exports.terms = function(req, res) {
    res.render('terms', {
        title: 'Terms of Service'
    });
};