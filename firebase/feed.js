import { openProfile } from "./openProfile.js";
import { toggleLike } from "./likes.js";
import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed = document.getElementById("feed");

let allPosts = [];
let rendered = 0;

const POSTS_PER_PAGE = 10;

onValue(ref(database, "posts"), snapshot => {

    allPosts = [];
    rendered = 0;

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

    snapshot.forEach(child => {

        allPosts.push({

            id: child.key,

            ...child.val()

        });

    });

    allPosts.sort((a, b) =>

        (b.createdAt || 0) -

        (a.createdAt || 0)

    );

    loadMorePosts();

});

function loadMorePosts() {

    const end = Math.min(

        rendered + POSTS_PER_PAGE,

        allPosts.length

    );

    for (let i = rendered; i < end; i++) {

        renderPost(allPosts[i]);

    }

    rendered = end;

}

function renderPost(post) {

    const card = document.createElement("article");

    card.className = "post fade-in";

    const media =

        post.type === "video"

        ?

        `<video
            class="uploaded-media"
            src="${post.media}"
            controls
            playsinline
            preload="metadata">
        </video>`

        :

        `<img
            class="uploaded-media"
            src="${post.media}"
            loading="lazy">`;

    card.innerHTML = `

<div class="post-header">

<div class="post-user">

<img
class="mini-avatar profile-link"
data-uid="${post.uid}"
src="${post.photo || "../assets/default-avatar.png"}">

<div>

<div
class="post-name profile-link"
data-uid="${post.uid}">

${post.username}

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

<button
class="comment-btn"
data-id="${post.id}">

💬 ${post.comments || 0}

</button>

<button
class="share-btn">

Share

</button>

</div>

`;

    feed.appendChild(card);

    card.querySelector(".like-btn").onclick = () => {

        toggleLike(post.id);

    };

    card.querySelector(".comment-btn").onclick = () => {

        window.location.href =
        `comments.html?post=${post.id}`;

    };

    card.querySelector(".share-btn").onclick = async () => {

        if (navigator.share) {

            try {

                await navigator.share({

                    title: "Snap X",

                    text: post.caption,

                    url: post.media

                });

            } catch {}

        }

    };

    card.querySelectorAll(".profile-link").forEach(item => {

        item.onclick = () =>

            openProfile(item.dataset.uid);

    });

}

window.addEventListener("scroll", () => {

    if (

        window.innerHeight +

        window.scrollY

        >=

        document.body.offsetHeight - 500

    ) {

        if (rendered < allPosts.length) {

            loadMorePosts();

        }

    }

});
