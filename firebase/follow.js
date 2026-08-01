import { auth, database } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function toggleFollow(targetUid){

    const currentUser = auth.currentUser;

    if(!currentUser){
        alert("Please login.");
        return;
    }

    if(currentUser.uid === targetUid){
        return;
    }

    const meRef =
        ref(database, `users/${currentUser.uid}/following`);

    const targetRef =
        ref(database, `users/${targetUid}/followers`);

    const meSnap = await get(meRef);
    const targetSnap = await get(targetRef);

    const following =
        meSnap.val() || {};

    const followers =
        targetSnap.val() || {};

    if(following[targetUid]){

        delete following[targetUid];
        delete followers[currentUser.uid];

    }else{

        following[targetUid] = true;
        followers[currentUser.uid] = true;

    }

    await update(
        ref(database, `users/${currentUser.uid}`),
        {
            following
        }
    );

    await update(
        ref(database, `users/${targetUid}`),
        {
            followers
        }
    );

}
