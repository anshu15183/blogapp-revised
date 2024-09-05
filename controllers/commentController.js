// import model
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { response } = require("express");

// business Logic
exports.createComment = async (req, res) => {
	try {
		// fetch data from request body
		const { post, user, body } = req.body;

		// Validate that post and user exist
		const postExists = await Post.findById(post);
		if (!postExists) {
			return res.json({ message: "Post not found" });
		}

		// create comment object
		const comment = new Comment({ post, user, body });
		// save the new comment object into the db
		const savedComment = await comment.save();

		// Find the Post By Id and the new comment to its comment array
		const updatedPost = await Post.findByIdAndUpdate(
			post,
			{ $push: { comments: savedComment._id } },
			{ new: true }
		)
			.populate("comments") //Populates the comment array with the comments document
			.exec();

		return res.json({ post: updatedPost });
	} catch (err) {
		return res.status(500).json({
			error: "Error while creating comment",
		});
	}
};

exports.viewComment = async (req, res) => {
	try {
		// fetch data from request body
		const { post } = req.query;

		// Validate that the post exists
		const postExists = await Post.findById(post).populate("comments");
		if (!postExists) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Return the post with the populated comments
		return res.json({ data: postExists.comments });
	} catch (err) {
		return res.status(500).json({
			error: "Error while fetching comments",
			details: err.message,
		});
	}
};
