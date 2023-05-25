const { Comment } = require("../models");

const seedData = [
	{
		body: "Doing great, how about you?",
		author_id: 1,
		post_id: 3,
	},
	{
		body: "How did you possibly beat me??",
		author_id: 2,
		post_id: 1,
	},
	{
		body: "great! Hope this community thrives!",
		author_id: 3,
		post_id: 3,
	},
];

const seedComments = async () =>
	await Comment.bulkCreate(seedData, {
		individualHooks: true,
		returning: true,
	});
module.exports = seedComments;
