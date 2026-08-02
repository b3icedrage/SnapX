import { auth, database } from "./firebase.js";

import {
    ref,
    push,
    onValue,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get("post");

const commentsList = document.getElementById("commentsList");
const input = document.getElementById("commentInput");
const sendBtn = document.getElementById("sendComment");

if (!postId) {

    commentsList.innerHTML = "<p>Post not found.</p>";

    throw new Error("Missing post id");

}

const commentsRef = ref(database, `comments/${postId}`);

onValue(commentsRef, (snapshot) => {

    commentsList.innerHTML = "";

    if (!snapshot.exists()) {

        commentsList.innerHTML = `
            <p class="empty-feed">
                No comments yet.<br>
                Be the first to comment!
            </p>
        `;

        return;

    }

    const comments = [];

    snapshot.forEach(child => {

        comments.push(child.val());

    });

    comments.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    comments.forEach(comment => {

        const item = document.createElement("div");

        item.className = "comment-item";

        item.innerHTML = `

            <div class="comment-name">

                ${comment.username || "Unknown"}

            </div>

            <div class="comment-text">

                ${comment.text}

            </div>

            <div class="comment-time">

                ${new Date(comment.createdAt).toLocaleString()}

            </div>

        `;

        commentsList.appendChild(item);

    });

});

sendBtn.onclick = async () => {

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first.");

        return;

    }

    const text = input.value.trim();

    if (!text) return;

    await push(commentsRef, {

        uid: user.uid,

        username: user.email,

        text,

        createdAt: Date.now()

    });

    // Update comment count on the post
    const postRef = ref(database, "posts/" + postId);

    const snap = await get(postRef);

    if (snap.exists()) {

        const post = snap.val();

        await update(postRef, {

            comments: (post.comments || 0) + 1

        });

    }

    input.value = "";

};
