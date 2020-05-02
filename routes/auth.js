const router = require("express").Router();
const passport = require('passport');

router.get('/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/user',
	passport.authenticate('google', { failureRedirect: '/' }),
	function (req, res) {
		res.redirect("/user/" + req.user.email);
	});

router.get('/facebook',
	passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/user',
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/user/" + req.user.email);
	});

module.exports = router;