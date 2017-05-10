// -- Home Controller ----------------------------------------------------------

// GET /
exports.index = function(req, res) {
    res.render('home', {
        title: 'Atrium-Drive'
    });
};