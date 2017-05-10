let express = require("express");
let mongoose = require("mongoose");
let dotenv = require("dotenv");
let bodyParser = require("body-parser");
var compression = require("compression");
let state = require("express-state");
let exphbs = require("express-handlebars");
let validator = require("express-validator");
var session = require("express-session");
var flash = require("express-flash");
let passport = require("passport");
let logger = require("morgan");

// -- Library files ------------------------------------------------------------
let hbshelpers = require("./lib/helpers.js");
let passport_config = require('./lib/passport.config');

// -- Load enviroment variables ------------------------------------------------
dotenv.load();

// -- Controllers --------------------------------------------------------------
var HomeController = require("./controllers/home.controller");
var userController = require("./controllers/user.controller");
var dashboardController = require("./controllers/dashboard.controller");
var awsController = require("./controllers/aws.controller");

//-- Connect to MongoDB --------------------------------------------------------
mongoose.connect(process.env.MONGODB);
mongoose.connection.on("error", function() {
    console.log("MongoDB Connection Error.");
    process.exit(1);
});

//-- Setup Express App ---------------------------------------------------------
let app = express();
state.extend(app);
app.set("state namespace", "App");
app.engine(
    "handlebars",
    exphbs({ defaultLayout: "main", helpers: hbshelpers })
);
app.set("view engine", "handlebars");
app.enable("view cache");
app.use(express.static("public"));

app.set("state namespace", "App");
app.expose({}, "Data");

app.use(logger("dev"));

router = express.Router({
    caseSensitive: app.get("case sensitive routing"),
    strict: app.get("strict routing")
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(validator());
app.use(compression());

app.use(
    session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(router);

//-- Routes --------------------------------------------------------------------
router.get("/", HomeController.index);
router.get("/terms", HomeController.terms);

router.get("/dashboard", dashboardController.index);

router.get('/sign', awsController.sign);

router.get("/logout", userController.logout);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);


//-- Start Server --------------------------------------------------------------
app.listen(process.env.PORT, function() {
    console.log("Express server listening on port " + process.env.PORT);
});

module.exports = app;