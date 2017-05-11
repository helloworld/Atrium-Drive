var async = require("async");
var crypto = require("crypto");
var passport = require("passport");
var User = require("../models/user.model");

// -- User Controller ----------------------------------------------------------
exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/login");
	}
};

// -- GET /logout --------------------------------------------------------------
exports.logout = function(req, res) {
    req.logout();
    res.redirect("/");
};

// -- GET /login ---------------------------------------------------------------
exports.loginGet = function(req, res) {
	if (req.user) return res.redirect("/");
	res.render("account/login", {
		title: "Log in"
	});
};

// -- POST /login --------------------------------------------------------------
exports.loginPost = function(req, res, next) {
	req.assert("email", "Email is not valid").isEmail();
	req.assert("email", "Email cannot be blank").notEmpty();
	req.assert("password", "Password cannot be blank").notEmpty();
	req.sanitize("email").normalizeEmail({
		remove_dots: false
	});

	var errors = req.validationErrors();

	if (errors) {
		req.flash("error", errors);
		return res.redirect("/login");
	}

	passport.authenticate("local", function(err, user, info) {
		if (!user) {
			req.flash("error", info);
			return res.redirect("/login");
		}
		req.logIn(user, function(err) {
			if (user.admin) return res.redirect("/backpanel");
			res.redirect("/dashboard");
		});
	})(req, res, next);
};

// -- GET /signup --------------------------------------------------------------
exports.signupGet = function(req, res) {
	if (req.user) return res.redirect("/");
	res.render("account/signup", {
		title: "Sign up"
	});
};

// -- POST /signup -------------------------------------------------------------
exports.signupPost = function(req, res, next) {
	req.assert("name", "Name cannot be blank").notEmpty();
	req.assert("email", "Email is not valid").isEmail();
	req.assert("email", "Email cannot be blank").notEmpty();
	req
		.assert("password", "Password must be at least 4 characters long")
		.len(4);
	req.sanitize("email").normalizeEmail({
		remove_dots: false
	});

	var errors = req.validationErrors();

	if (errors) {
		req.flash("error", errors);
		return res.redirect("/signup");
	}

	User.findOne(
		{
			email: req.body.email
		},
		function(err, user) {
			if (user) {
				req.flash("error", {
					msg: "The email address you have entered is already\
                     associated with another account."
				});
				return res.redirect("/signup");
			}
			user = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			});
			user.save(function(err) {
				req.logIn(user, function(err) {
					res.redirect("/");
				});
			});
		}
	);
};

// -- POST /account -------------------------------------------------------------
exports.accountGet = function(req, res) {
    res.render('account/profile', {
        title: 'My Account'
    });
};

// -- PUT /account -------------------------------------------------------------
exports.accountPut = function(req, res, next) {
    if ('password' in req.body) {
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.assert('confirm', 'Passwords must match').equals(req.body.password);
    } else {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('email', 'Email cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({
            remove_dots: false
        });
    }

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if ('password' in req.body) {
            user.password = req.body.password;
        } else {
            user.email = req.body.email;
            user.name = req.body.name;
        }
        user.save(function(err) {
            if ('password' in req.body) {
                req.flash('success', {
                    msg: 'Your password has been changed.'
                });
            } else if (err && err.code === 11000) {
                req.flash('error', {
                    msg: 'The email address you have entered is already associated with another account.'
                });
            } else {
                req.flash('success', {
                    msg: 'Your profile information has been updated.'
                });
            }
            res.redirect('/account');
        });
    });
};

// -- DELETE /account -------------------------------------------------------------
exports.accountDelete = function(req, res, next) {
    User.remove({
        _id: req.user.id
    }, function(err) {
        req.logout();
        req.flash('info', {
            msg: 'Your account has been permanently deleted.'
        });
        res.redirect('/');
    });
};