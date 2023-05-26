const router = require("express").Router();
const { User, Post } = require("../models");
const withAuth = require("../utils/authq");
const { ClogHttp } = require("../utils/clog");

router.get("/", async (req, res) => {
	const clog = new ClogHttp(" GET /");
	try {
		// Get all projects and JOIN with user data
		const postData = await Post.findAll({
			include: [
				{
					model: User,
					attributes: ["name"],
				},
			],
		});

		// Serialize data so the template can read it
		const posts = postData.map((post) => post.get({ plain: true }));

		// Pass serialized data and session flag into template
		if (posts) {
			clog.httpStatus(200, "RENDER");
			// res.status(200).json(posts);
			res.render("homepage");
		} else {
			clog.httpStatus(404);
			// res.status(404).json({ status: 404, message: "No users in db" });
			res.render("homepage");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/dashboard", withAuth, async (req, res) => {
	const clog = new ClogHttp("GET /dashboard");
	try {
		if (!req.session.logged_in) {
			res.redirect("/login");
			return;
		}
		const userData = await User.findByPk(req.session.user_id, {
			attributes: {
				exclude: ["password"],
			},
			include: [{ model: Post }],
		});

		const user = userData.get({ plain: true });

		clog.httpStatus(200);
		res.render("dashboard", {
			...user,
		});
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.get("/login", (req, res) => {
	const clog = new ClogHttp("GET /login", true);
	// If the user is already logged in, redirect the request to another route
	if (req.session.logged_in) {
		res.redirect("/dashboard");
		return;
	}

	clog.httpStatus(200);
	res.status(200).render("login");
	// clog.critical("GET for '/login' not implmented yet!");
	// clog.httpStatus(400);
	// res.status(400).end();
});

router.get("/post/:id", async (req, res) => {
	const clog = new ClogHttp(`GET /post/${req.params["id"]}`);
	try {
		const postData = await Post.findByPk(req.params.id, {
			include: [
				{
					model: User,
					attributes: ["name"],
				},
			],
		});

		const post = postData.get({ plain: true });

		res.render("post", {
			...post,
			logged_in: req.session.logged_in,
		});
		clog.httpStatus(200);
		res.status(200).json(post);
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

module.exports = router;
