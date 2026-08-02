import { openProfile } from "./openProfile.js";
import { toggleLike } from "./likes.js";
import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed = document.getElementById("feed");

const POSTS_PER_PAGE = 10;
const PRELOAD_AHEAD = 2;

let allPosts = [];
let rendered = 0;
let loading = false;

/* -----------------------------
   Load posts from Firebase
------------------------------ */

onValue(ref(database, "posts"), (snapshot) => {

    allPosts = [];
    rendered = 0;
    loading = false;

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

    // newest posts first
    allPosts.sort((a, b) =>
        (b.createdAt || 0) -
        (a.createdAt || 0)
    );

    removeSkeleton();

    loadMorePosts();

});

/* -----------------------------
   Remove skeleton loader
------------------------------ */

function removeSkeleton() {

    const skeleton =
        document.getElementById("skeletonFeed");

    if (skeleton) {
        skeleton.remove();
    }

}

/* -----------------------------
   Infinite scrolling loader
------------------------------ */

function loadMorePosts() {

    if (loading) return;

    loading = true;

    const end = Math.min(
        rendered + POSTS_PER_PAGE,
        allPosts.length
    );

    for (let i = rendered; i < end; i++) {

        renderPost(allPosts[i]);

    }

    rendered = end;

    loading = false;

    preloadUpcomingVideos();

}

/* -----------------------------
   Preload upcoming videos
------------------------------ */

function preloadUpcomingVideos() {

    for (
        let i = rendered;
        i < Math.min(rendered + PRELOAD_AHEAD, allPosts.length);
        i++
    ) {

        const post = allPosts[i];

        if (post.type === "video") {

            const video = document.createElement("video");

            video.src = post.media;
            video.preload = "metadata";

        }

    }

}

/* -----------------------------
   Infinite scroll listener
------------------------------ */

window.addEventListener("scroll", () => {

    if (

        window.innerHeight +
        window.scrollY >=
        document.body.offsetHeight - 500

    ) {

        if (rendered < allPosts.length) {

            loadMorePosts();

        }

    }

});
/* -----------------------------
   Render a single post
------------------------------ */

function renderPost(post) {

    const card = document.createElement("article");
    card.className = "post fade-in";

    const media = post.type === "video"
        ? `
        <video
            class="uploaded-media"
            src="${post.media}"
            controls
            playsinline
            preload="metadata">
        </video>
        `
        : `
        <img
            class="uploaded-media"
            src="${post.media}"
            loading="lazy"
            alt="Snap">
        `;

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
                ${post.username || "Unknown User"}
            </div>

            <div class="post-time">
                ${new Date(post.createdAt || Date.now()).toLocaleString()}
            </div>

        </div>

    </div>

</div>

<div class="media-container">

    ${media}

    <div class="heart-animation">
        ❤️
    </div>

</div>

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

    <button class="share-btn">
        Share
    </button>

</div>

`;

    feed.appendChild(card);

    /* -----------------------------
       FIXED: Query after innerHTML
    ------------------------------ */

    const mediaElement =
        card.querySelector(".uploaded-media");

    const heart =
        card.querySelector(".heart-animation");

    const likeBtn =
        card.querySelector(".like-btn");

    const commentBtn =
        card.querySelector(".comment-btn");

    const shareBtn =
        card.querySelector(".share-btn");

    /* -----------------------------
       Double-tap like
    ------------------------------ */

    let lastTap = 0;

    mediaElement.addEventListener("click", () => {

        const now = Date.now();

        if (now - lastTap < 300) {

            heart.classList.add("show");

            setTimeout(() => {

                heart.classList.remove("show");

            }, 700);

            toggleLike(post.id);

        }

        lastTap = now;

    });

    /* -----------------------------
       Like button
    ------------------------------ */

    likeBtn.addEventListener("click", () => {

        toggleLike(post.id);

    });

    /* -----------------------------
       Comment button
    ------------------------------ */

    commentBtn.addEventListener("click", () => {

        window.location.href =
            `comments.html?post=${post.id}`;

    });

    /* -----------------------------
       Share button
    ------------------------------ */

    shareBtn.addEventListener("click", async () => {

        if (navigator.share) {

            try {

                await navigator.share({

                    title: "Snap X",

                    text: post.caption || "Check this out!",

                    url: post.media

                });

            } catch (err) {

                console.log("Share cancelled.");

            }

        } else {

            try {

                await navigator.clipboard.writeText(post.media);

                alert("Link copied!");

            } catch {

                alert(post.media);

            }

        }

    });

    /* -----------------------------
       Open profile
    ------------------------------ */

    card.querySelectorAll(".profile-link").forEach(item => {

        item.addEventListener("click", () => {

            openProfile(item.dataset.uid);

        });

    });

}

/* ==========================================
   Pull To Refresh
========================================== */

let startY = 0;
let pulling = false;

window.addEventListener("touchstart", (e) => {

    if (window.scrollY === 0) {

        startY = e.touches[0].clientY;
        pulling = true;

    }

});

window.addEventListener("touchmove", (e) => {

    if (!pulling) return;

    const distance = e.touches[0].clientY - startY;

    if (distance > 120) {

        pulling = false;

        // Reload the latest posts
        window.location.reload();

    }

});

window.addEventListener("touchend", () => {

    pulling = false;

});


/* ==========================================
   Better Video Preloading
========================================== */

function preloadVisibleVideos() {

    const videos = document.querySelectorAll("video.uploaded-media");

    videos.forEach((video) => {

        const rect = video.getBoundingClientRect();

        if (

            rect.top < window.innerHeight * 2 &&
            rect.bottom > -window.innerHeight

        ) {

            video.preload = "auto";

        }

    });

}

window.addEventListener("scroll", preloadVisibleVideos);

window.addEventListener("load", preloadVisibleVideos);


/* ==========================================
   Feed Statistics
========================================== */

function getFeedStats() {

    return {

        totalPosts: allPosts.length,
        renderedPosts: rendered,
        remainingPosts: allPosts.length - rendered

    };

}


/* ==========================================
   Refresh Feed
========================================== */

function refreshFeed() {

    rendered = 0;

    feed.innerHTML = "";

    loadMorePosts();

}


/* ==========================================
   Empty Feed Helper
========================================== */

function showEmptyFeed() {

    feed.innerHTML = `

    <div class="empty-feed">

        <h2>No posts yet</h2>

        <p>Be the first to upload a Snap 🚀</p>

    </div>

    `;

}


/* ==========================================
   Performance Monitor
========================================== */

console.log("🚀 Snap X Feed Ready");

console.log(getFeedStats());


/* ==========================================
   Expose Helpers (optional)
========================================== */

window.snapxFeed = {

    refresh: refreshFeed,
    stats: getFeedStats

};
