// jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require("multer-storage-cloudinary");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// -------------------------------------------------------------------------------------------------------------------------------
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb://localhost:27017/blogWebsite", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const Blog = require('./models/blog');
const User = require('./models/user');

// ----------------------------------------------------------------------------------------------------------------------------

const createPassportStrategies = require('./passportStrategies/passport-config');
createPassportStrategies();

passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
// --------------------------------------------------------------------------------------------------------------------

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// --------------------------------------------------------------------------------------------------------------------

const auth = require('./routes/auth');
const login = require('./routes/login');
const user = require('./routes/user');
const compose = require('./routes/compose');
const blog = require('./routes/blog');
const search = require('./routes/search');
const index = require('./routes/index');
const register = require('./routes/register');

app.use('/auth', auth);
app.use('/login', login);
app.use('/user', user);
app.use('/compose', compose);
app.use('/blog', blog);
app.use('/search', search);
app.use('/', index);
app.use('/register', register);


app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});





let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}
app.listen(port, function () {
	console.log("app started on port 3000");
});