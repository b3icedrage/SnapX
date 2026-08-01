import { auth, database } from "./firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function getHomeFeed(){

    const user = auth.currentUser;

    if(!user) return [];

    const followingSnap =
        await get(
            ref(database,
            `users/${user.uid}/following`)
        );

    const following =
        followingSnap.val() || {};

    following[user.uid] = true;

    const postsSnap =
        await get(ref(database,"posts"));

    if(!postsSnap.exists())
        return [];

    const posts =
        Object.entries(postsSnap.val())
        .map(([id,post])=>({
            id,
            ...post
        }))
        .filter(post=>following[post.uid])
        .sort((a,b)=>b.createdAt-a.createdAt);

    return posts;

}
