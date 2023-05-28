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
	{
		body: "Playing Destiny 2 right now",
		author_id: 2,
		post_id: 4,
	},
	{
		body: "Playing D2 as well, how about that?",
		author_id: 3,
		post_id: 4,
	},
	{
		body: "Sounds good, im @hossi#1111",
		author_id: 2,
		post_id: 5,
	},
	{
		body: "Yeah sure, I'm @thestranman#2324",
		author_id: 3,
		post_id: 5,
	},
];

const seedComments = async () =>
	await Comment.bulkCreate(seedData, {
		individualHooks: true,
		returning: true,
	});
module.exports = seedComments;
