import { auth, database } from "./firebase.js";

import {
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    const grid = document.getElementById("userPosts");

    const postsCounter = document.getElementById("posts");

    onValue(ref(database, "posts"), (snapshot) => {

        grid.innerHTML = "";

        if (!snapshot.exists()) {

            postsCounter.textContent = "0";

            grid.innerHTML = `
                <p style="text-align:center;color:#888;">
                    You haven't posted anything yet.
                </p>
            `;

            return;
        }

        const posts = [];

        snapshot.forEach((child) => {

            const post = child.val();

            if (post.uid === user.uid) {

                posts.push({
                    id: child.key,
                    ...post
                });

            }

        });

        posts.sort((a, b) => b.createdAt - a.createdAt);

        postsCounter.textContent = posts.length;

        posts.forEach((post) => {

            const card = document.createElement("div");
            card.className = "profile-post";

            const media = post.type === "video"
                ? `<video src="${post.media}" muted></video>`
                : `<img src="${post.media}">`;

            card.innerHTML = `
                ${media}

                <button class="delete-post">
                    🗑
                </button>
            `;

            card.onclick = () => {

                if (post.type === "video") {

                    window.open(post.media);

                } else {

                    window.open(post.media);

                }

            };

            card
            .querySelector(".delete-post")
            .onclick = async (e) => {

                e.stopPropagation();

                const ok = confirm(
                    "Delete this post?"
                );

                if (!ok) return;

                await remove(
                    ref(database, "posts/" + post.id)
                );

            };

            grid.appendChild(card);

        });

    });

});
