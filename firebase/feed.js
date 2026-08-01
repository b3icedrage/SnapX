import { likePost } from "./likes.js";
import { database } from "./firebase.js";
import {
    addComment,
    watchComments
} from "./comments.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed = document.getElementById("feed");

const postsRef = ref(database, "posts");

onValue(postsRef, (snapshot) => {

    const data = snapshot.val();

    feed.innerHTML = "";

    if (!data) {

        feed.innerHTML = `
            <div class="empty-feed">
                <h2>No posts yet</h2>
                <p>Upload the first Snap 🚀</p>
            </div>
        `;

        return;
    }

    const posts = Object.entries(data)
        .map(([id, post]) => ({
            id,
            ...post
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

    posts.forEach(post => {

        const card = document.createElement("article");
        card.className = "post fade-in";

        const media = post.type === "video"
            ? `
                <video
                    class="uploaded-media"
                    src="${post.media}"
                    controls
                    playsinline
                ></video>
              `
            : `
                <img
                    class="uploaded-media"
                    src="${post.media}"
                    alt="Snap X post"
                >
              `;

        card.innerHTML = `
            <div class="post-header">

                <div class="post-user">

                    <div class="post-avatar">
                        ${post.username ? post.username.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div>

                        <div class="post-name">
                            ${post.username || "Unknown"}
                        </div>

                        <div class="post-time">
                            ${new Date(post.createdAt).toLocaleString()}
                        </div>

                    </div>

                </div>

            </div>

            ${media}

            <div class="post-content">
                <p>${post.caption || ""}</p>
            </div>

            <div class="actions">

                <button
class="like-btn"
data-id="${post.id}">

❤️ ${post.likes || 0}

</button>

                <button>💬 ${post.comments || 0}</button>

                <button>↗️ Share</button>

            </div>
        `;

        feed.appendChild(card);
const likeBtn = card.querySelector(".like-btn");

likeBtn.onclick = () => {

    likePost(post.id);

};

    });

});
