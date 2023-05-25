const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

User.hasMany(Post);
User.hasMany(Comment);
Post.belongsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Post);

module.exports = { User, Post, Comment };
