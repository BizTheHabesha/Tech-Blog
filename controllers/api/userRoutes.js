const router = require("express").Router();
const { User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/", true);
	try {
		const userData = await User.create(req.body);

		req.session.save(() => {
			req.session.user_id = userData.id;
			req.session.logged_in = true;
			clog.httpStatus(200, "user created");
			res.status(200).json(userData);
		});
	} catch (err) {
		clog.httpStatus(400, err.message);
		res.status(400).json(err);
	}
});

router.post("/login", async (req, res) => {
	const clog = new ClogHttp("POST /api/users/login", true);
	try {
		const userData = await User.findOne({
			where: { email: req.body.email },
		});

		if (!userData) {
			clog.httpStatus(400, "Incorrect email or password");
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
			res.status(204).end();
		});
	} else {
		clog.httpStatus(404, "not logged in");
		res.status(404).end();
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
