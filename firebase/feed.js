import { openProfile } from "./openProfile.js";
import { toggleLike } from "./likes.js";
import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed = document.getElementById("feed");

const postsRef = ref(database, "posts");

onValue(postsRef, (snapshot) => {
console.log("Feed snapshot:", snapshot.val());

    feed.innerHTML = "";

    if (!snapshot.exists()) {

        feed.innerHTML = `
            <div class="empty-feed">
                <h2>No posts yet</h2>
                <p>Upload the first Snap 🚀</p>
            </div>
        `;

        return;

    }

    const posts = [];

    snapshot.forEach(child => {

        posts.push({

            id: child.key,

            ...child.val()

        });

    });

    posts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    posts.forEach(post => {

        const card = document.createElement("article");

        card.className = "post fade-in";

        const media = post.type === "video"

            ? `
                <video
                    class="uploaded-media"
                    src="${post.media}"
                    controls
                    playsinline>
                </video>
            `

            : `
                <img
                    class="uploaded-media"
                    src="${post.media}"
                    alt="Snap X Post">
            `;

        card.innerHTML = `

            <div class="post-header">

                <div class="post-user">

                    <img
                        class="mini-avatar profile-link"
                        data-uid="${post.uid}"
                        src="${post.photo || "../assets/default-avatar.png"}"
                        alt="Avatar">

                    <div>

                        <div
                            class="post-name profile-link"
                            data-uid="${post.uid}">

                            ${post.username || "Unknown"}

                        </div>

                        <div class="post-time">

                            ${new Date(post.createdAt || Date.now()).toLocaleString()}

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

                <button>

                    💬 ${post.comments || 0}

                </button>

                <button
                    class="share-btn">

                    ↗️ Share

                </button>

            </div>

        `;

        feed.appendChild(card);

        card.querySelector(".like-btn").onclick = () => {

            toggleLike(post.id);

        };

        card.querySelector(".share-btn").onclick = async () => {

            if (navigator.share) {

                try {

                    await navigator.share({

                        title: "Snap X",

                        text: post.caption || "Check out this Snap!",

                        url: post.media

                    });

                } catch (e) {

                    console.log(e);

                }

            } else {

                navigator.clipboard.writeText(post.media);

                alert("Link copied!");

            }

        };

        card.querySelectorAll(".profile-link").forEach(item => {

            item.onclick = () => {

                openProfile(item.dataset.uid);

            };

        });

    });

});
