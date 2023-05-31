const router = require("express").Router();
const { Comment, User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/comments/", true);
	try {
		if (!req.body["body"]) {
			clog.httpStatus(406, "Comment body wasn't defined!");
			res.status(406).json({
				status: 406,
				message: "Not acceptable. Comment body must be defined",
			});
			return;
		}
		clog.warn(JSON.stringify(req.body));
		const createRes = await Comment.create({
			...req.body,
			author_id: req.session.user_id,
		});
		if (createRes) {
			clog.httpStatus(201, JSON.stringify(createRes));
			res.status(201).json(createRes);
		} else {
			clog.httpStatus(
				9503,
				"Comment create failed, sequelize service unavailable?"
			);
			res.status(503).json({
				status: 503,
				message: "Create failed, sequelize service unavailable",
			});
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/comments/");
	try {
		const findRes = await Comment.findAll({ include: User });
		if (findRes.length) {
			clog.httpStatus(200);
			res.status(200).json(findRes);
			return;
		}
		clog.httpStatus(404, "No comments in database");
		res.status(404).json({ error: "No comments in database" });
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ error: err.message });
	}
});

router.get("/p:post_id", async (req, res) => {
	const clog = new ClogHttp(`GET /api/comments/p${req.params["post_id"]}`);
	try {
		const findRes = await Comment.findAll({
			where: {
				post_id: req.params["post_id"],
			},
			include: User,
		});
		if (findRes.length) {
			clog.httpStatus(200);
			res.status(200).json(findRes);
			return;
		}
		clog.httpStatus(404, "No comments in database");
		res.status(404).json({ error: "No comments in database" });
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ error: err.message });
	}
});

router.get("/:comment_id", async (req, res) => {
	const clog = new ClogHttp(`GET /api/comments/${req.params["comment_id"]}`);
	try {
		const findRes = await Comment.findByPk(req.params["comment_id"], {
			include: User,
		});
		if (findRes) {
			clog.httpStatus(200);
			res.status(200).json(findRes);
			return;
		}
		clog.httpStatus(
			404,
			`Comment ID ${req.params["comment_id"]} does not exist`
		);
		res.status(404).json({ error: "Comment not found." });
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ error: err.message });
	}
});

router.delete("/:comment_id", async (req, res) => {
	const clog = new ClogHttp(
		`DELETE /api/comments/${req.params["comment_id"]}`
	);
	try {
		const delRes = await Comment.destroy({
			where: {
				id: req.params["comment_id"],
			},
		});
		if (delRes) {
			clog.httpStatus(202, `ID ${req.params["comment_id"]} destroyed`);
			res.status(202).json(delRes);
			return;
		}
		clog.httpStatus(
			404,
			`Comment ID ${req.params["comment_id"]} does not exist`
		);
		res.status(404).json({ error: "Comment not found." });
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
