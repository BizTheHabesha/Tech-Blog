const router = require("express").Router();
const { User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/users/", true);
	try {
		const findRes = await User.findAll();
		if (findRes) {
			clog.httpStatus(200);
			res.status(200).json(findRes);
			return;
		}
		clog.httpStatus(404, "No users in database");
		res.status(404);
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ message: clog.statusMessage(500) });
	}
});

router.get("/logged_in?", async (req, res) => {
	const clog = new ClogHttp("GET /api/users/logged_in?", true);
	try {
		clog.httpStatus(
			200,
			`Session is${req.session.logged_in ? " " : " not "}logged in${
				req.session.logged_in
					? ` as User ID ${req.session.user_id}`
					: ""
			}`
		);
		res.status(200).json({
			logged_in: !!req.session.logged_in,
			user_id: req.session.user_id,
		});
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ error: err.message });
	}
});

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/", true);
	try {
		const createRes = await User.create(req.body);
		if (createRes) {
			clog.info(JSON.stringify(createRes));
			req.session.save(() => {
				req.session.user_id = createRes.id;
				req.session.logged_in = true;
				clog.httpStatus(200, "user created");
				res.status(200).json(createRes);
				return;
			});
		} else {
			clog.critical(`falsy createRes ${JSON.stringify(createRes)}`);
			clog.httpStatus(503, "sequelize service unavailable");
			res.status(503).json({ message: "sequelize service unavailable" });
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.post("/login", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/login", true);
	try {
		const userData = await User.findOne({
			where: { email: req.body.email },
		});

		if (!userData) {
			clog.httpStatus(400, "Email does not have an account");
			res.status(400).json({
				message: "This email does not have an account.",
			});
			return;
		}

		const validPassword = await userData.C_PW_UH(req.body.password);

		if (!validPassword) {
			clog.httpStatus(400, "Incorrect email or password");
			res.status(400).json({
				message: "Incorrect email or password, please try again.",
			});
			return;
		}

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;
			clog.httpStatus(
				200,
				`User ${req.session.user_id} is now logged in...`
			);
			res.status(200).json({
				user: userData,
				message: "You are now logged in!",
			});
		});
	} catch (err) {
		clog.httpStatus(400, err.message);
		res.status(400).json(err);
	}
});

router.post("/logout", (req, res) => {
	const clog = new ClogHttp("POST /api/users/logout", true);
	if (req.session.logged_in) {
		req.session.destroy(() => {
			clog.httpStatus(204, "session destroyed");
			res.status(204).json({ message: "Session destroyed." });
		});
	} else {
		clog.httpStatus(404, "not logged in");
		res.status(404).json({ error: "Not logged in." });
	}
});

router.delete("/", (req, res) => {
	const clog = new ClogHttp("DELETE /api/users/", true);
	if (req.session.logged_in) {
		clog.httpStatus(501, "DELETE NOT IMPLEMENTED FOR USERS");
		res.sendStatus(501);
	} else {
		clog.httpStatus(404);
		res.status(404).json({ message: "not logged in" });
	}
});

module.exports = router;
