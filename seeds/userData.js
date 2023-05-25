const { User } = require("../models");

const seedData = [
	{
		name: "Biz Gebremeskelhaymnotyemichaellidetamlakinayeexhabrinsim",
		email: "email@gmail.com",
		password: "password123",
	},
	{
		name: "Jossi Hossi",
		email: "joss@gmail.com",
		password: "ihavebadpasswords",
	},
	{
		name: "Michael Stranbrought",
		email: "mstranbrought@gmail.com",
		password: "greatpassword!",
	},
];

const seedUsers = async () =>
	await User.bulkCreate(seedData, {
		individualHooks: true,
	});
module.exports = seedUsers;
