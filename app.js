// jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(session({
	secret: "mySecret",
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
	blogs: [blogSchema]
});
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
const Blog = mongoose.model("Blog", blogSchema);
const User = mongoose.model("User", userSchema);

// passport.use(User.createStrategy());
passport.use(new LocalStrategy({
	usernameQueryFields: ['email']
}, User.authenticate()));
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

var registrationErr = false;
app.get("/", function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/user/"+req.user.email);
	}
	else {
		res.render("home", { registrationErr: registrationErr });
	}
	registrationErr = false;
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
				res.redirect("/user/"+req.user.email);
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
				res.redirect("/user/"+req.user.email);
			});
		}
	});
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

app.route("/search")
	.get(function (req, res) {
		res.render("search");
	})

	.post(function (req, res) {
		res.redirect("/search");
	});


app.get("/user/:user", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("user");
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
	User.findOneAndUpdate({ firstName: "abc" }, { $push: { blogs: blog } }, { useFindAndModify: false }, function (err, user) {
		if (!err)
			res.redirect("/user");
	});
});




app.listen("3000", function () {
	console.log("app started on port 3000");
});