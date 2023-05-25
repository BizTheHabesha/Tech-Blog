// config .env
require("dotenv").config();
// import sequelize
const Sequelize = require("sequelize");
// initialize sequlize var to export later
let sequelize;
if (process.env.JAWSDB_URL) {
	// if jawsdb url is defined, use jawsdb to initialize Sequelize
	sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
	// otherwise set up with local environment variables
	sequelize = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		{
			host: "localhost",
			dialect: "mysql",
			port: 3306,
		}
	);
}
// export sequelize
module.exports = sequelize;
