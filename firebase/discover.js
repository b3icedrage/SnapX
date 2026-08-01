import { auth, database } from "./firebase.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { toggleFollow } from "./follow.js";

const feed = document.getElementById("discoverFeed");
const userResults = document.getElementById("userResults");
const searchInput = document.getElementById("searchInput");

/* ---------- Trending Posts ---------- */

onValue(ref(database, "posts"), (snapshot) => {

    feed.innerHTML = "";

    if (!snapshot.exists()) {
        feed.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    const posts = [];

    snapshot.forEach(post => {

        posts.push({
            id: post.key,
            ...post.val()
        });

    });

    posts.sort((a, b) => {

        const likesA = a.likes || 0;
        const likesB = b.likes || 0;

        if (likesA === likesB) {
            return b.createdAt - a.createdAt;
        }

        return likesB - likesA;

    });

    posts.forEach(post => {

        const media =
            post.type === "video"
            ? `<video class="uploaded-media" src="${post.media}" controls playsinline></video>`
            : `<img class="uploaded-media" src="${post.media}">`;

        feed.innerHTML += `
            <div class="post">

                ${media}

                <div class="post-content">

                    <b>${post.username}</b>

                    <p>${post.caption || ""}</p>

                    <div class="actions">

                        <button>❤️ ${post.likes || 0}</button>

                        <button>💬 ${post.comments || 0}</button>

                    </div>

                </div>

            </div>
        `;

    });

});

/* ---------- Live User Search ---------- */

let users = {};

onValue(ref(database, "users"), snapshot => {

    users = snapshot.val() || {};

    renderUsers("");

});

searchInput.oninput = () => {

    renderUsers(searchInput.value.trim().toLowerCase());

};

function renderUsers(query) {

    userResults.innerHTML = "";

    Object.entries(users).forEach(([uid, user]) => {

        const name =
            (user.displayName || user.username || "").toLowerCase();

        if (query && !name.includes(query))
            return;

        const following =
            user.followers &&
            auth.currentUser &&
            user.followers[auth.currentUser.uid];

        const card = document.createElement("div");

        card.className = "user-card";

        card.innerHTML = `
            <img
            src="${user.photo || "../assets/default-avatar.png"}"
            class="mini-avatar">

            <div class="user-info">

                <h3>
                    ${user.displayName || user.username}
                </h3>

                <p>
                    ${user.bio || ""}
                </p>

            </div>

            <button
            class="follow-btn">

                ${following ? "Following" : "Follow"}

            </button>
        `;

        card
        .querySelector(".follow-btn")
        .onclick = () => {

            toggleFollow(uid);

        };

        card.querySelector(".mini-avatar").onclick = () => {

    window.location.href =
        `user.html?uid=${uid}`;

};

card.querySelector("h3").onclick = () => {

    window.location.href =
        `user.html?uid=${uid}`;

};

userResults.appendChild(card);

    });

}
