const apiUrl = "http://localhost:4000/api/v1"; // Replace with your API URL

global_user = prompt("Enter user name");
document.getElementById("user_").innerText = `User: ${global_user}`;
if (global_user === null || global_user.trim() === "") {
	alert("User name is required. Please reload the page and enter a valid user name.");
	location.reload();
}

// Function to create a post
async function createPost() {
	console.log("create post function called");
	const title = document.getElementById("postTitle").value;
	const body = document.getElementById("postBody").value;

	if (!title || !body) {
		alert("Title and body are required");
		return;
	}

	try {
		const response = await fetch(`${apiUrl}/posts/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title, body }),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		displayPosts(); // Refresh the list of posts
		alert("New post created");
		document.getElementById("postTitle").value = "";
		document.getElementById("postBody").value = "";
	} catch (error) {
		console.error("Error creating post:", error);
	}
}

// Function to fetch and display posts
async function displayPosts() {
	try {
		const response = await fetch(`${apiUrl}/posts`);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		const posts = data.data;
		console.log(posts);

		// Reverse the posts array to show the newest post first
		const reversedPosts = [...posts].reverse();

		const postsList = document.getElementById("postsList");
		postsList.innerHTML = "";

		// Render posts
		reversedPosts.forEach((post) => {
			const postElement = document.createElement("div");
			postElement.className = "post-item";
			postElement.innerHTML = `
				                        <h3>${post.title}</h3>
				                        <p>${post.body}</p>
				                        <div class="form-group">
				                            <input type="text" id="comments_input_${post._id}" class="form-control" placeholder="Comment" />
				                        </div>

				                        <div class="comments-dropdown">
											<button class="btn btn-secondary" onclick="postcomment('${post._id}')">Add Comment</button>
				                            
				                            <button class="btn btn-success" onclick="toggleLike('${post._id}')">Like</button>
				                            <button class="btn btn-info" onclick="viewComments('${post._id}')">View Comments</button>
				                            <div id="comments-${post._id}" style="display: none;"></div>
				                        </div>
				                    `;
			postsList.appendChild(postElement);
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
	}
}

// Function to add a comment
async function postcomment(postId) {
	try {
		const commentBox = document.getElementById(`comments_input_${postId}`);
		const commentBody = commentBox.value;

		if (!commentBody) {
			console.log("Comment cannot be empty");
			return;
		}

		const response = await fetch(`${apiUrl}/comments/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				post: postId,
				user: global_user,
				body: commentBody,
			}),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		commentBox.value = "";

		viewComments(postId); // Refresh comments
		alert("Commented");
	} catch (error) {
		console.error("Error creating comment:", error);
	}
}

// Function to toggle like/unlike
async function toggleLike(postId) {
	try {
		const response = await fetch(`${apiUrl}/likes/like`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				post: postId,
				user: global_user,
			}), // logged in user
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		// Update the like button color based on the like status
		/*const likeButton = document.getElementById(
							`like-button-${postId}`
						);
						if (data.liked) {
							likeButton.innerText = "unlike";
						} else {
							likeButton.innerText = "like";
						}
*/
		console.log("Post liked/unliked:", data);
		alert(data.message);
	} catch (error) {
		console.error("Error liking/unliking post:", error);
	}
}

// Function to view comments for a post
async function viewComments(postId) {
	const commentsContainer = document.getElementById(`comments-${postId}`);
	if (commentsContainer.style.display === "none") {
		commentsContainer.style.display = "block";
	} else {
		commentsContainer.style.display = "none";
		return;
	}

	if (commentsContainer.innerHTML === "") {
		try {
			const response = await fetch(`${apiUrl}/comments/view?post=${postId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const comments_ = await response.json();
			// Check if the result contains the comments array
			if (Array.isArray(comments_.data)) {
				const comments = comments_.data;

				comments.forEach((comment) => {
					const commentElement = document.createElement("div");

					commentElement.innerHTML = `<hr>
				                            <p>${comment.body}</p>
				                        `;

					commentsContainer.appendChild(commentElement);
				});
			} else {
				console.error("No comments found or invalid format.");
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	}
}

// Load posts on page load
document.addEventListener("DOMContentLoaded", displayPosts);
