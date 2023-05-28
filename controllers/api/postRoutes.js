const router = require("express").Router();
const { Post } = require("../../models");
const { ClogHttp } = require("../../utils/clog");

router.delete("/:post_id", async (req, res) => {
	const clog = new ClogHttp(`POST /api/post/${req.params["post_id"]}`, true);
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
			clog.httpStatus(404);
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

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/post", true);
	try {
		if (!req.body["post_title"] || !req.body["post_body"]) {
			res.status(406).json({
				status: 406,
				message: "Post creation not attmpted (not acceptable). ",
			});
		}
		const createRes = await Post.create();
		if (createRes) {
			clog.httpStatus(200, JSON.stringify(createRes));
			res.status(200).json(createRes);
		} else {
			clog.httpStatus(
				1503,
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
