const router = require("express").Router();
const Blog = require('../models/blog');

router.get("/:blogId", function (req, res) {
	Blog.findById(req.params.blogId, function (err, foundBlog) {
		if (err)
			res.redirect("/");
		else {
			if (req.isAuthenticated()) {
				res.render("blog", { loggedIn: true, blog: foundBlog, user: req.user });
			}
			else {
				res.render("blog", { loggedIn: false, blog: foundBlog });
			}
		}
	});

});

module.exports = router;