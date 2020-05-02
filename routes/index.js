const router = require("express").Router();
const registrationErr = require('../helpers/registrationErr');

router.get("/", function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/user/" + req.user.email);
	}
	else {
		res.render("home", { registrationErr: registrationErr.getRegistrationErr() });
	}
	registrationErr.setRegistrationErr(false);
});

module.exports = router;