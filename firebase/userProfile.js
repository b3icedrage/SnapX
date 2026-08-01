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
