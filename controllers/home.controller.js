// -- Home Controller ----------------------------------------------------------

// GET /
exports.index = function(req, res) {
    res.render('home', {
        title: 'Atrium-Drive'
    });
};

exports.terms = function(req, res) {
    res.render('terms', {
        title: 'Terms of Service'
    });
};