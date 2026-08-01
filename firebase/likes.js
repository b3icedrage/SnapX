import { database, auth } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function likePost(postId) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login.");
        return;
    }

    const postRef = ref(database, "posts/" + postId);

    const snap = await get(postRef);

    if (!snap.exists()) return;

    const post = snap.val();

    const likedBy = post.likedBy || {};

    if (likedBy[user.uid]) {

        delete likedBy[user.uid];

    } else {

        likedBy[user.uid] = true;

    }

    const likes = Object.keys(likedBy).length;

    await update(postRef, {

        likedBy,

        likes

    });

}
