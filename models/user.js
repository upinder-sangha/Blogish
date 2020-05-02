const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const Blog = require('./blog');

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	googleId: String,
	facebookId: String,
	blogs: [Blog.schema]
});
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

module.exports = User;