// jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static("public"));







app.get("/", function (req, res) {
	res.render("home");
});

app.get("/register", function (req, res) {
	res.render("register");
});





app.listen("3000", function () {
	console.log("app started on port 3000");
});