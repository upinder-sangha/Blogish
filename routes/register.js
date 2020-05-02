const router = require("express").Router();
const registrationErr = require('../helpers/registrationErr');
const User = require('../models/user');
const passport = require('passport');

router.post("/", function (req, res) {
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.username
	};
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			registrationErr.setRegistrationErr(err);
			res.redirect("/");
		}
		else {
			passport.authenticate("local")(req, res, function () {
				res.redirect("/user/" + req.user.email);
			});
		}
	});
});

module.exports = router;