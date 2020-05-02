const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

module.exports = function () {
	passport.use(new LocalStrategy({
		usernameQueryFields: ['email']
	}, User.authenticate()));

	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "https://frozen-woodland-68686.herokuapp.com/auth/google/user"
		// callbackURL: "http://localhost:3000/auth/google/user"
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
		callbackURL: "https://frozen-woodland-68686.herokuapp.com/auth/facebook/user",
		// callbackURL: "http://localhost:3000/auth/facebook/user",
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
	
}
