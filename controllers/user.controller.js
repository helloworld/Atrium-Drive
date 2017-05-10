var async = require("async");
var crypto = require("crypto");
var passport = require("passport");
var User = require("../models/user.model");

exports.loginGet = function(req, res) {
    res.render("account/login", {
        title: "Log in"
    });
};

exports.signupGet = function(req, res) {
    res.render("account/signup", {
        title: "Sign up"
    });
};