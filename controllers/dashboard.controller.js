// -- Dashboard Controller -----------------------------------------------------

// -- GET /dashboard -----------------------------------------------------------
exports.index = function(req, res) {
    res.render('dashboard', {
        title: 'Atrium-Drive'
    });
};
