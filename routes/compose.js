const router = require("express").Router();
const User = require('../models/user');
const multer = require('multer');
const cloudinary = require('cloudinary');
const Blog = require('../models/blog');

var storage = multer.diskStorage({});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), function (req, res) {
	cloudinary.v2.uploader.upload(req.file.path, { folder: "Blogish/Blog Images" + req.user.email }, function (err, data) {

		if (!err) {
			const blog = new Blog({
				title: req.body.blogTitle,
				body: req.body.blogBody,
				image: data.url,
			});
			blog.save();
			User.findOneAndUpdate({ email: req.user.email }, { $push: { blogs: blog } }, { useFindAndModify: false }, function (err, user) {
				if (!err)
					res.redirect("/user/" + req.user.email);
			});
		}
		else
			res.send(err);
	});
});



// router.post('/', upload.array('image', 10), function (req, res) {
// 	const email = req.user.email;
// 	console.log(req.files);
// 	const imageurls = [];
// 	req.files.forEach(file => {
// 		cloudinary.v2.uploader.upload(file.path, { folder: "Blog Website/Blog Images/" + email }, function (err, data) {

// 			if (!err) {
// 				console.log(data.url);
// 				imageurls.push(data.url);
// 			}
// 			else
// 				console.log(err);
// 		});
// 	});
// 	console.log(imageurls);
// 	const blog = new Blog({
// 		title: req.body.blogTitle,
// 		body: req.body.blogBody,
// 		image: imageurls
// 	});
// 	blog.save();
// 	User.findOneAndUpdate({ email: req.user.email }, { $push: { blogs: blog } }, { useFindAndModify: false }, function (err, user) {
// 		if (!err)
// 			res.redirect("/user/" + req.user.email);
// 	});

// });

module.exports = router;