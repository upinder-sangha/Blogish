// jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

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



mongoose.connect("mongodb://localhost:27017/blogWebsite", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const blogSchema = new mongoose.Schema({
	title: String,
	body: String
});
const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	googleId: String,
	facebookId: String,
	blogs: [blogSchema]
});
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(findOrCreate);
const Blog = mongoose.model("Blog", blogSchema);
const User = mongoose.model("User", userSchema);

// passport.use(User.createStrategy());
passport.use(new LocalStrategy({
	usernameQueryFields: ['email']
}, User.authenticate()));

passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "http://localhost:3000/auth/google/user"
},
	function (accessToken, refreshToken, profile, cb) {
		User.findOrCreate(
			{ email: profile.emails[0].value },
			{ googleId: profile.id, firstName: profile.name.givenName, lastName: profile.name.familyName, },
			function (err, user) {
				return cb(err, user);
			});
	}
));
passport.use(new facebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: "http://localhost:3000/auth/facebook/user",
	profileFields: ['id', 'emails', 'name']
},
	function (accessToken, refreshToken, profile, cb) {
		User.findOrCreate(
			{ facebookId: profile.id, email: profile.emails[0].value },
			{ firstName: profile.name.givenName, lastName: profile.name.familyName },
			function (err, user) {
				return cb(err, user);
			});
	}
));


passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
// --------------------------------------------------------------------------------------------------------------------

var registrationErr = false;

app.get("/", function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/user/" + req.user.email);
	}
	else {
		res.render("home", { registrationErr: registrationErr });
	}
	registrationErr = false;
});

app.get('/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/user',
	passport.authenticate('google', { failureRedirect: '/' }),
	function (req, res) {
		res.redirect("/user/" + req.user.email);
	});

app.get('/auth/facebook',
	passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/user',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/user/" + req.user.email);
	});


app.post('/login', function (req, res) {
	const user = new User({
		email: req.body.username,
		password: req.body.password
	});
	req.login(user, function (err) {
		if (err) {
			console.log(err);
		}
		else {
			passport.authenticate("local")(req, res, function (err) {
				res.redirect("/user/" + req.user.email);
			});
		}
	});
});


app.post("/register", function (req, res) {
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.username
	};
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			registrationErr = err;
			res.redirect("/");
		}
		else {
			passport.authenticate("local")(req, res, function () {
				console.log(res);
				res.redirect("/user/" + req.user.email);
			});
		}
	});
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});


app.get("/user/:user", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("user", { blogs: req.user.blogs });
	}
	else {
		res.redirect("/");
	}
});

app.post("/compose", function (req, res) {
	const blog = new Blog({
		title: req.body.blogTitle,
		body: req.body.blogBody
	});
	blog.save();
	User.findOneAndUpdate({ email: req.user.email }, { $push: { blogs: blog } }, { useFindAndModify: false }, function (err, user) {
		if (!err)
			res.redirect("/user/" + req.user.email);
	});
});

app.get("/blog/:blogId", function (req, res) {
	Blog.findById(req.params.blogId, function (err, foundBlog) {
		if (err)
			res.redirect("/");
		else {
			if (req.isAuthenticated()) {
				res.render("blog", { loggedIn: true, blog: foundBlog });
			}
			else {
				res.render("blog", { loggedIn: false, blog: foundBlog });
			}
		}
	});

});


app.route("/search")
	.get(function (req, res) {
		res.render("search");
	})

	.post(function (req, res) {
		res.redirect("/search");
	});



app.listen("3000", function () {
	console.log("app started on port 3000");
});