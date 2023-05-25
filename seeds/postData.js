const { Post } = require("../models");

const seedData = [
	{
		title: "First post!",
		body: "The first post on the blog! How's everyone doing?",
		author_id: 1,
	},
	{
		title: "Second post!",
		body: "How the hell did Biz beat me to the first? And what is that name??",
		author_id: 2,
	},
	{
		title: "What is this?",
		body: "Hey everyone, just found this. What going on!",
		author_id: 3,
	},
];

const seedPosts = async () => await Post.bulkCreate(seedData);
module.exports = seedPosts;
