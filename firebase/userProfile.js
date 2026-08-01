import { auth, database } from "./firebase.js";
import { toggleFollow } from "./follow.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const uid = params.get("uid");

if (!uid) {
    alert("User not found.");
    window.location.replace("trending.html");
}

const avatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const userBio = document.getElementById("userBio");

const posts = document.getElementById("userPosts");
const followers = document.getElementById("userFollowers");
const following = document.getElementById("userFollowing");

const postGrid = document.getElementById("userPostGrid");
onValue(ref(database, "posts"), (snapshot) => {

    postGrid.innerHTML = "";

    if (!snapshot.exists()) {

        postGrid.innerHTML = `
            <p style="text-align:center;">
                No posts yet.
            </p>
        `;

        posts.textContent = "0";

        return;
    }

    const userPosts = [];

    snapshot.forEach((child) => {

        const post = child.val();

        if (post.uid === uid) {

            userPosts.push({
                id: child.key,
                ...post
            });

        }

    });

    userPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    posts.textContent = userPosts.length;

    if (userPosts.length === 0) {

        postGrid.innerHTML = `
            <p style="text-align:center;">
                No posts yet.
            </p>
        `;

        return;
    }

    userPosts.forEach((post) => {

        const card = document.createElement("div");

        card.className = "profile-post";

        if (post.type === "video") {

            card.innerHTML = `
                <video
                    src="${post.media}"
                    muted
                    playsinline
                    preload="metadata">
                </video>
            `;

        } else {

            card.innerHTML = `
                <img
                    src="${post.media}"
                    alt="Post">
            `;

        }

        card.onclick = () => {

            sessionStorage.setItem(
                "snapx_selected_post",
                JSON.stringify(post)
            );

            window.location.href =
                "viewPost.html";

        };

        postGrid.appendChild(card);

    });

});

const followBtn = document.getElementById("followBtn");

onValue(ref(database, "users/" + uid), snapshot => {

    if (!snapshot.exists()) {

        userName.textContent = "User not found";
        return;

    }

    const user = snapshot.val();

    avatar.src =
        user.photo || "../assets/default-avatar.png";

    userName.textContent =
        user.displayName ||
        user.username ||
        "Snap X User";

    userBio.textContent =
        user.bio ||
        "No bio yet.";

    followers.textContent =
        user.followers
            ? Object.keys(user.followers).length
            : 0;

    following.textContent =
        user.following
            ? Object.keys(user.following).length
            : 0;

    const current = auth.currentUser;

    if (!current) return;

    if (current.uid === uid) {

        followBtn.textContent = "Edit Profile";
        followBtn.onclick = () => {

            window.location.href = "profile.html";

        };

        return;

    }

    const isFollowing =
        user.followers &&
        user.followers[current.uid];

    followBtn.textContent =
        isFollowing
            ? "Following"
            : "Follow";

    followBtn.onclick = async () => {

        await toggleFollow(uid);

    };

});
