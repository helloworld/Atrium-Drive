let express = require("express");
let mongoose = require("mongoose");
let dotenv = require("dotenv");
let bodyParser = require("body-parser");
var compression = require("compression");
var methodOverride = require('method-override');
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
var apiController = require("./controllers/api.controller");

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
app.use(methodOverride('_method'));

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
let authenticated = userController.ensureAuthenticated;

router.get("/", HomeController.index);
router.get("/terms", HomeController.terms);
router.get("/documentation", HomeController.documentation);


router.get("/dashboard", authenticated, dashboardController.index);
router.post("/dashboard/addFile", authenticated, dashboardController.addFile);
router.post("/dashboard/editFile", authenticated, dashboardController.editFile);
router.post("/dashboard/deleteFile", authenticated, dashboardController.deleteFile);
router.post('/dashboard/newToken', userController.ensureAuthenticated, dashboardController.newToken);
router.get('/sign', authenticated, awsController.sign);

router.get("/logout", userController.logout);
router.get("/login", userController.loginGet);
router.post("/login", userController.loginPost);
router.get("/signup", userController.signupGet);
router.post("/signup", userController.signupPost);
router.get('/account', userController.ensureAuthenticated, userController.accountGet);
router.put('/account', userController.ensureAuthenticated, userController.accountPut);
router.delete('/account', userController.ensureAuthenticated, userController.accountDelete);

router.get("/api/list", apiController.list);
router.delete("/api/delete/:_id", apiController.delete);


//-- Start Server --------------------------------------------------------------
app.listen(process.env.PORT, function() {
    console.log("Express server listening on port " + process.env.PORT);
});

module.exports = app;