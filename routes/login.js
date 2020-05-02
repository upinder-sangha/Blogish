const router = require("express").Router();
const User = require('../models/user');
const passport = require('passport');


router.post('/', function (req, res) {
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

module.exports = router;