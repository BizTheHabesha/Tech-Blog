const { Post } = require("../models");

const seedData = [
	{
		id: 1,
		title: "First post!",
		body: "The first post on the blog! How's everyone doing?",
		author_id: 1,
	},
	{
		id: 2,
		title: "Second post!",
		body: "How the hell did Biz beat me to the first? And what is that name??",
		author_id: 2,
	},
	{
		id: 3,
		title: "What is this?",
		body: "Hey everyone, just found this. What going on!",
		author_id: 3,
	},
	{
		id: 4,
		title: "What are you guys up to?",
		body: "Just curious what everyone's up to right now?",
		author_id: 1,
	},
	{
		id: 5,
		title: "Lot of gamers!",
		body: "Looks like you're all gamers! How about we dm on dis and get some games going?",
		author_id: 1,
	},
];

const seedPosts = async () => await Post.bulkCreate(seedData);
module.exports = seedPosts;
