const path = require("path");
const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");
const helpers = require("./utils/helpers");
const { ClogHttp } = require("./utils/clog");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
	secret: "Super secret secret",
	cookie: {
		maxAge: 300000,
		httpOnly: true,
		secure: false,
		sameSite: "strict",
	},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
	}),
};

app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

app.get("*", (req, res) => {
	const clog = new ClogHttp("catchall", true);
	clog.httpStatus(404, `${JSON.stringify(req.route)}`);
	res.status(404).render("notfound");
});

sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => {
		const clog = new ClogHttp("Server Init", false);
		clog.success(`Now listening on port ${PORT}`);
	});
});
