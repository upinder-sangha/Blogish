const router = require("express").Router();
const Blog = require('../models/blog');

router.route("/")
	.post(function (req, res) {
		Blog.find({ title: { $regex: req.body.searchQuery, $options: "i" } }, function (err, foundBlogs) {
			// console.log(foundBlogs);
			if (req.isAuthenticated()) {
				res.render("search", { blogs: foundBlogs, loggedIn: true, user: req.user });
			}
			else {
				res.render("search", { blogs: foundBlogs, loggedIn: false });
			}

		});
	});

module.exports = router;