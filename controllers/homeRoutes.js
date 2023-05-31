const router = require("express").Router();
const { User, Post, Comment } = require("../models");
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
			order: [["createdAt", "DESC"]],
		});
		// Serialize data so the template can read it
		const posts = postData.map((post) => post.get({ plain: true }));

		// Pass serialized data and session flag into template
		if (posts) {
			clog.info("rendering...", true);
			clog.httpStatus(200);
			res.render("homepage", {
				logged_in: !!req.session.logged_in,
				posts,
			});
		} else {
			clog.httpStatus(404);
			clog.info("rendering...", true);
			res.render("homepage", {
				logged_in: !!req.session.logged_in,
			});
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		clog.info("rendering...", true);
		res.render("homepage", {
			logged_in: !!req.session.logged_in,
			error: clog.statusMessage(500),
		});
	}
});

router.get("/dashboard", withAuth, async (req, res) => {
	const clog = new ClogHttp("GET /dashboard");
	try {
		if (!req.session.logged_in) {
			clog.httpStatus(100, "redirect to /login");
			res.redirect("/login");
			return;
		}
		const postData = await Post.findAll({
			where: { author_id: req.session.user_id },
		});
		const posts = postData.map((post) => post.get({ plain: true }));
		clog.info("rendering...", true);

		res.render("dashboard", {
			logged_in: !!req.session.logged_in,
			posts,
		});
	} catch (err) {
		clog.httpStatus(500, err.message);
		clog.info("rendering...", true);

		res.render("dashboard", {
			logged_in: !!req.session.logged_in,
			error: clog.statusMessage(500),
		});
	}
});

router.get("/newpost", withAuth, async (req, res) => {
	const clog = new ClogHttp("GET /newpost");
	try {
		if (!req.session.logged_in) {
			clog.httpStatus(100, "redirect to /login");
			res.redirect("/login");
			return;
		}

		clog.httpStatus(200);
		clog.info("rendering...", true);

		res.render("newpost", {
			logged_in: !!req.session.logged_in,
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
		clog.httpStatus(100, "redirect to /dashboard");
		res.redirect("/dashboard");
		return;
	}

	clog.httpStatus(200);
	clog.info("rendering...", true);
	res.status(200).render("login", { logged_in: !!req.session.logged_in });
});

router.get("/signup", (req, res) => {
	const clog = new ClogHttp("GET /signup", true);
	if (req.session.logged_in) {
		clog.statusMessage(100, "logged in, redirect to /dashboard");
		res.redirect("/dashboard");
		return;
	}
	clog.httpStatus(200);
	clog.info("rendering...", true);

	res.status(200).render("signup", {
		logged_in: !!req.session.logged_in,
	});
});

router.get("/post/:id", async (req, res) => {
	const clog = new ClogHttp(`GET /post/${req.params["id"]}`, true);
	try {
		const postData = await Post.findByPk(req.params.id, {
			include: [
				{
					model: User,
					attributes: ["name", "id"],
				},
				{
					model: Comment,
					order: ["createdAt", "ASC"],
					include: {
						model: User,
						attributes: ["name", "id"],
					},
				},
			],
		});
		if (!postData) {
			clog.httpStatus(404, `ID ${req.params.id} could not be found!`);
			res.render("post", {
				error: "This post could not be found. Maybe it was deleted?",
			});
			return;
		}
		const post = postData.get({ plain: true });
		post.comments = post.comments.map((comment) => {
			comment.logged_in_user_id = req.session.user_id === comment.user.id;
			return comment;
		});
		clog.warn(JSON.stringify(post.comments), false);
		clog.error(JSON.stringify(req.session.user_id));
		clog.critical(
			`FINAL: ${req.session.user_id} == ${post.user.id}  => ${
				req.session.user_id == post.user.id
			}`
		);
		clog.info("rendering...", true);
		clog.httpStatus(200);
		res.render("post", {
			logged_in_user_id: req.session.user_id == post.user.id,
			logged_in: !!req.session.logged_in,
			...post,
		});
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.render("post", {
			error: clog.statusMessage(500),
		});
	}
});

module.exports = router;
