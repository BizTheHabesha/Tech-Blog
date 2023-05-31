const { ClogHttp } = require("./clog");

const withAuth = (req, res, next) => {
	const clog = new ClogHttp("withAuth() => redir?", true);
	// If the user is not logged in, redirect the request to the login route
	if (!req.session.logged_in) {
		clog.httpStatus(100, "/login");
		res.redirect("/login");
	} else {
		clog.info("continue");
		next();
	}
};

module.exports = withAuth;
