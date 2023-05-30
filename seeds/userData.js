const { User } = require("../models");

const seedData = [
	{
		id: 1,
		name: "Biz Gebremeskelhaymnotyemichaellidetamlakinayeexhabrinsim",
		email: "email@gmail.com",
		password: "password123",
	},
	{
		id: 2,
		name: "Jossi Hossi",
		email: "joss@gmail.com",
		password: "ihavebadpasswords",
	},
	{
		id: 3,
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
