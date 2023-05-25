const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config");

class User extends Model {
	/**
	 * Check stored hash vs hash passed in. Return equivelence.
	 * @param {String} pw bcrypt-hashed string
	 * @returns {Boolean}
	 */
	C_PW_UH(pw) {
		return bcrypt.compareSync(pw, this.password);
	}
}

User.init(
	{
		// unique user id for every user that auto increments to ensure unique ids
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		// usernames for users
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// unique emails for each user, validated for actual emails
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		// a password for this user validated to be at least 8 characters, contain a letter, number, and special character
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		// hooks for the User model
		hooks: {
			// before a user is created: hash their password
			beforeCreate: async (newUserData) => {
				newUserData.password = await bcrypt.hash(
					newUserData.password,
					12
				);
				return newUserData;
			},
			beforeUpdate: async (updatedUserData) => {
				updatedUserData.password = await bcrypt.hash(
					updatedUserData.password,
					12
				);
				return updatedUserData;
			},
		},
		// sequelize for the model
		sequelize,
		// timestamps not nescceary
		timestamps: false,
		// ensure the table name matches the model name
		freezeTableName: true,
		// underscore for spaces (n/a)
		underscored: true,
		// model name for external references
		modelName: "user",
	}
);

module.exports = User;
