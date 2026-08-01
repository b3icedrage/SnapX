import { auth, database } from "./firebase.js";
import { toggleFollow } from "./follow.js";
import { openProfile } from "./openProfile.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed = document.getElementById("discoverFeed");
const userResults = document.getElementById("userResults");
const searchInput = document.getElementById("searchInput");

/* --------------------------
   TRENDING POSTS
-------------------------- */

onValue(ref(database, "posts"), (snapshot) => {

    feed.innerHTML = "";

    if (!snapshot.exists()) {

        feed.innerHTML = "<p>No trending posts yet.</p>";
        return;

    }

    const posts = [];

    snapshot.forEach((child) => {

        posts.push({
            id: child.key,
            ...child.val()
        });

    });

    posts.sort((a, b) => {

        const likesA = a.likes || 0;
        const likesB = b.likes || 0;

        if (likesA === likesB) {

            return (b.createdAt || 0) - (a.createdAt || 0);

        }

        return likesB - likesA;

    });

    posts.forEach((post) => {

        const card = document.createElement("div");

        card.className = "post";

        const media =
            post.type === "video"
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
                    src="${post.media}">
                `;

        card.innerHTML = `

        <div class="post-header">

            <img
            class="mini-avatar profile-link"
            data-uid="${post.uid}"
            src="${post.photo || "../assets/default-avatar.png"}">

            <div style="flex:1">

                <b
                class="profile-link username"
                data-uid="${post.uid}">

                    ${post.username}

                </b>

            </div>

        </div>

        ${media}

        <div class="post-content">

            <p>${post.caption || ""}</p>

            <div class="actions">

                <button>

                    ❤️ ${post.likes || 0}

                </button>

                <button>

                    💬 ${post.comments || 0}

                </button>

            </div>

        </div>

        `;

        card.querySelectorAll(".profile-link")
        .forEach((item) => {

            item.onclick = () => {

                openProfile(item.dataset.uid);

            };

        });

        feed.appendChild(card);

    });

});

/* --------------------------
   LIVE USER SEARCH
-------------------------- */

let users = {};

onValue(ref(database, "users"), (snapshot) => {

    users = snapshot.val() || {};

    renderUsers(searchInput.value.trim().toLowerCase());

});

searchInput.addEventListener("input", () => {

    renderUsers(searchInput.value.trim().toLowerCase());

});

function renderUsers(query) {

    userResults.innerHTML = "";

    Object.entries(users).forEach(([uid, user]) => {

        const name =
            (
                user.displayName ||
                user.username ||
                ""
            ).toLowerCase();

        if (query && !name.includes(query))
            return;

        const following =
            auth.currentUser &&
            user.followers &&
            user.followers[auth.currentUser.uid];

        const card = document.createElement("div");

        card.className = "user-card";

        card.innerHTML = `

            <img
            class="mini-avatar"
            src="${user.photo || "../assets/default-avatar.png"}">

            <div class="user-info">

                <h3>

                    ${user.displayName || user.username}

                </h3>

                <p>

                    ${user.bio || ""}

                </p>

            </div>

            <button class="follow-btn">

                ${following ? "Following" : "Follow"}

            </button>

        `;

        card.onclick = () => {

            openProfile(uid);

        };

        card
        .querySelector(".follow-btn")
        .onclick = (e) => {

            e.stopPropagation();

            toggleFollow(uid);

        };

        userResults.appendChild(card);

    });

}
