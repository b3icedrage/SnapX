import { toggleLike } from "./likes.js";
import { openProfile } from "./openProfile.js";
import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed = document.getElementById("snapsFeed");

onValue(ref(database, "posts"), (snapshot) => {

    feed.innerHTML = "";

    if (!snapshot.exists()) {

        feed.innerHTML = "<h2>No videos yet.</h2>";

        return;

    }

    const videos = [];

    snapshot.forEach(item => {

        const post = item.val();

        if (post.type === "video") {

            videos.push({

                id: item.key,

                ...post

            });

        }

    });

    videos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    videos.forEach(post => {

        const snap = document.createElement("section");

        snap.className = "snap-page";

        snap.innerHTML = `

<video
class="snap-video"
src="${post.media}"
loop
muted
playsinline
autoplay
preload="auto">
</video>

<div class="snap-overlay">

<div class="snap-user">

<div class="snap-user-row">

<img
class="snap-avatar profile-link"
data-uid="${post.uid}"
src="${post.photo || "../assets/default-avatar.png"}">

<div>

<b
class="profile-link"
data-uid="${post.uid}">

${post.username}

</b>

<p>

${post.caption || ""}

</p>

</div>

</div>

</div>

<div class="snap-actions">

<button
class="like-btn"
data-id="${post.id}">

❤️

<span>

${post.likes || 0}

</span>

</button>

<button
class="comment-btn"
data-id="${post.id}">

💬

<span>

${post.comments || 0}

</span>

</button>

<button
class="share-btn"
data-id="${post.id}">

↗

</button>

</div>

</div>

`;

        feed.appendChild(snap);

    });

    /* -----------------------------
       Autoplay visible video only
    ----------------------------- */

    const videoElements =
        document.querySelectorAll(".snap-video");

    videoElements.forEach(video => {

        video.pause();

    });

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                const video = entry.target;

                if (entry.isIntersecting &&
                    entry.intersectionRatio > 0.7) {

                    videoElements.forEach(v => {

                        if (v !== video) {

                            v.pause();

                        }

                    });

                    video.play().catch(() => {});

                } else {

                    video.pause();

                }

            });

        },

        {

            threshold: 0.7

        }

    );

    videoElements.forEach(video => {

        observer.observe(video);

    });

    /* -----------------------------
       Tap video to play/pause
    ----------------------------- */

    videoElements.forEach(video => {

    video.onclick = () => {

        if (video.muted) {

            // Mute all other videos
            videoElements.forEach(v => {

                v.muted = true;

            });

            // Unmute the selected video
            video.muted = false;
            video.volume = 1;

            video.play().catch(console.error);

        } else {

            if (video.paused) {

                video.play().catch(console.error);

            } else {

                video.pause();

            }

        }

    };

});

    /* -----------------------------
       Open public profile
    ----------------------------- */

    document
        .querySelectorAll(".profile-link")
        .forEach(item => {

            item.onclick = () => {

                openProfile(item.dataset.uid);

            };

        });

    /* -----------------------------
       Share button
    ----------------------------- */

    document
        .querySelectorAll(".share-btn")
        .forEach(button => {

            button.onclick = async () => {

                const url =
                    location.origin +
                    "/pages/viewPost.html?id=" +
                    button.dataset.id;

                try {

                    if (navigator.share) {

                        await navigator.share({

                            title: "Snap X",

                            text: "Check out this Snap!",

                            url

                        });

                    } else {

                        await navigator.clipboard.writeText(url);

                        alert("Link copied!");

                    }

                } catch (e) {

                    console.log(e);

                }

            };

        });

    /* -----------------------------
       Like button
       (Connect to toggleLike() later)
    ----------------------------- */

    document
        .querySelectorAll(".like-btn")
        .forEach(button => {

            button.onclick = () => {

    toggleLike(button.dataset.id);

};

        });

    /* -----------------------------
       Comment button
    ----------------------------- */

    document
        .querySelectorAll(".comment-btn")
        .forEach(button => {

            button.onclick = () => {

                window.location.href =
                    "comments.html?post=" +
                    button.dataset.id;

            };

        });

});
