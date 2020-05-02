const router = require("express").Router();

router.get("/:user", function (req, res) {
	if (req.isAuthenticated()) {
		res.render("user", { blogs: req.user.blogs, user: req.user });
	}
	else {
		res.redirect("/");
	}
});

module.exports = router;