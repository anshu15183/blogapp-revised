// Import Models
const Post = require("../models/postModel");
const Like = require("../models/likeModel");
const { response } = require("express");

// Like a Post
exports.togglelikePost = async (req, res) => {
	try {
		const { post, user } = req.body;

		// Validate that post exists
		const postExists = await Post.findById(post);
		if (!postExists) {
			return res.json({ message: "Post not found" });
		}

		// Check if the user has already liked the post
		const existingLike = await Like.findOne({ post: post, user: user });
		if (existingLike) {
			// If like exists, unlike the post
			await Like.findByIdAndDelete(existingLike._id);

			/// Update the post to remove the like
			const updatedPost = await Post.findByIdAndUpdate(
				post,
				{ $pull: { likes: existingLike._id } },
				{ new: true }
			).populate("likes");

			return res.status(200).json({
				message: "Post unliked",
				post: updatedPost,
				liked: false, //like status
			});
		}

		const newlike = new Like({ post, user });
		const savedLike = await newlike.save();

		// Update Post Collection basis on this
		const updatedPost = await Post.findByIdAndUpdate(
			post,
			{ $push: { likes: savedLike._id } },
			{ new: true }
		).populate("likes");
		// .exec();

		res.status(200).json({
			message: "Post liked",
			post: updatedPost,
			liked: true,
		});
	} catch (err) {
		return res.status(500).json({
			error: "Error While toggling Like Post",
		});
	}
};
/*
// Unlike a Post
exports.unlikePost = async (req, res) => {
	try {
		const { post, like } = req.body;

		// Validate that post exists
		const postExists = await Post.findById(post);
		if (!postExists) {
			return res.json({ message: "Post not found" });
		}

		// Validate that the like exists and is associated with the post
		const likeExists = await Like.findOne({ _id: likeId, post: post });
		if (!likeExists) {
			return res.json({ message: "Like not found for this post" });
		}

		// // find and delete the from like collection
		// const deletedLike = await Like.findOneAndDelete({
		// 	post: post,
		// 	_id: like,
		// });

		// // update the post collection
		// const updatedPost = await Post.findByIdAndUpdate(
		// 	post,
		// 	{ $pull: { likes: deletedLike._id } },
		// 	{ new: true }
		// );

		// res.json({ post: updatedPost });
	} catch (err) {
		return res.status(500).json({
			error: "Error While unLike Post",
		});
	}
};
*/
