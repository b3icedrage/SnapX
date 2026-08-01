import { auth, database } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function toggleLike(postId) {

    const user = auth.currentUser;

    if (!user) return;

    const postRef = ref(database, "posts/" + postId);

    const snap = await get(postRef);

    if (!snap.exists()) return;

    const post = snap.val();

    const likedBy = post.likedBy || {};

    const likes = post.likes || 0;

    if (likedBy[user.uid]) {

        delete likedBy[user.uid];

        await update(postRef, {

            likes: Math.max(0, likes - 1),

            likedBy

        });

    } else {

        likedBy[user.uid] = true;

        await update(postRef, {

            likes: likes + 1,

            likedBy

        });

    }

}
