const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config");

class Comment extends Model {}

Comment.init(
	{
		// unique, auto-incremented id for every comment
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		// the body of every comment
		body: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// reference to the user who posted this comment
		author_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "user",
				key: "id",
			},
		},
		// reference to the post to which this comment was posted
		post_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "post",
				key: "id",
			},
		},
	},
	{
		// connect sequelize
		sequelize,
		// use timestamps for webpage
		timestamps: true,
		// table name should match model name
		freezeTableName: true,
		// spaces use underscores
		underscored: true,
		// the name of this model
		modelName: "comment",
	}
);

module.exports = Comment;
