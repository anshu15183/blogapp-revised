


const express = require('express');
const router = express.Router();

// Import Controller 
const {createComment, viewComment} = require("../controllers/commentController");
const {createPost,getAllPosts} = require("../controllers/postController");
const {togglelikePost,unlikePost} = require("../controllers/likeController");

// Mapping Create
router.post("/comments/create",createComment)
router.get("/comments/view",viewComment)
router.post("/posts/create",createPost)
router.get("/posts",getAllPosts)
router.post("/likes/like",togglelikePost)
// router.post("/likes/unlike",unlikePost)


// Export Controller
module.exports = router;