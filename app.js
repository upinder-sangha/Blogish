// jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/blogWebsite", { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
	title: String,
	body: String
});
const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	blogs: [blogSchema]
});
const Blog = mongoose.model("Blog", blogSchema);
const User = mongoose.model("User", userSchema);



app.get("/", function (req, res) {
	res.render("home");
});

app.post("/login", function (req, res) {

});

app.post("/register", function (req, res) {

});


app.route("/search")
	.get(function (req, res) {
		res.render("search");
	})

	.post(function (req, res) {
		res.redirect("/search");
	});


app.get("/user", function (req, res) {
	res.render("user");
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