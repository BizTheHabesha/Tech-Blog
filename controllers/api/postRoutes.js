const router = require("express").Router();
const { Post } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

router.delete("/:post_id", async (req, res) => {
	const clog = new ClogHttp(
		`DELETE /api/posts/${req.params["post_id"]}`,
		true
	);
	try {
		const destroyRes = await Post.destroy({
			where: { id: req.params["post_id"] },
		});
		if (destroyRes > 0) {
			clog.httpStatus(200, `ID ${req.params["post_id"]} destroyed`);
			res.status(200).json(destroyRes);
		} else {
			clog.httpStatus(404);
			res.status(404).json({
				status: 404,
				message: `ID ${req.params["post_id"]} not found`,
			});
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.get("/:post_id", async (req, res) => {
	const clog = new ClogHttp(`GET /api/posts/${req.params["post_id"]}`, true);
	try {
		const getRes = await Post.findByPk(req.params["post_id"]);
		if (getRes) {
			clog.httpStatus(200, `ID ${req.params["post_id"]} found.`);
			res.status(200).json(getRes);
		} else {
			clog.httpStatus(404, `ID ${req.params["post_id"]} not found.`);
			res.status(404).json({
				status: 404,
				message: `ID ${req.params["post_id"]} not found.`,
			});
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json(err);
	}
});

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/posts");
	try {
		const findRes = await Post.findAll();
		res.json(findRes);
	} catch (err) {
		clog.critical(err, err.message);
		res.sendStatus(500);
	}
});

router.put("/:post_id", async (req, res) => {
	const clog = new ClogHttp("PUT /api/posts", true);
	try {
		if (!req.body["title"] || !req.body["body"]) {
			clog.httpStatus(406, "Post title and post body must be defined!");
			res.status(406).json({
				status: 406,
				message:
					"Not acceptable. Post title and post body must be defined",
			});
			return;
		}
		const findRes = await Post.findByPk(req.params["post_id"]);
		if (findRes) {
			clog.info(`ID ${req.params["post_id"]} found.`);
			const updateRes = await Post.update(
				{ ...req.body },
				{
					where: {
						id: req.params["post_id"],
					},
				}
			);
			if (updateRes) {
				clog.httpStatus(201, `ID ${req.params["post_id"]} updated`);
				res.status(201).json(updateRes);
			} else {
				clog.httpStatus(
					9503,
					"Post create failed, sequelize service unavailable?"
				);
				res.status(503).json({
					status: 503,
					message: "Create failed, sequelize service unavailable",
				});
			}
		} else {
			clog.httpStatus(404, `ID ${req.params["post_id"]} not found.`);
			res.status(404).json({
				status: 404,
				message: `ID ${req.params["post_id"]} not found.`,
			});
		}
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.status(500).json({ error: err.message });
	}
});

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/posts", true);
	try {
		if (!req.body["title"] || !req.body["body"]) {
			clog.httpStatus(406, "Post title or post body wasn't defined!");
			res.status(406).json({
				status: 406,
				message:
					"Not acceptable. Post title and post body must be defined",
			});
			return;
		}
		const createRes = await Post.create({
			...req.body,
			author_id: req.session.user_id,
		});
		if (createRes) {
			clog.httpStatus(200, JSON.stringify(createRes));
			res.status(200).json(createRes);
		} else {
			clog.httpStatus(
				9503,
				"Post create failed, sequelize service unavailable?"
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

module.exports = router;
