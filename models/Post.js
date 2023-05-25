const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
	{
		// unique id for every post autoincremented to prevent reusing an ID
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		// post title that will appear on the webpage
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// post body that will appear on the webpage
		body: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// reference to the user who posted this blog post
		author_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "user",
				key: "id",
			},
		},
	},
	{
		// connect to sequelize
		sequelize,
		// use timestamps
		timestamps: true,
		// table name matches model name
		freezeTableName: true,
		// underscores for spaces
		underscored: true,
		// model name for references
		modelName: "post",
	}
);

module.exports = Post;
