import { database, auth } from "./firebase.js";

import {
    ref,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function addComment(postId, text) {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login.");
        return;
    }

    if (!text.trim()) return;

    await push(ref(database, `posts/${postId}/comments`), {

        uid: user.uid,

        username: user.email,

        text,

        createdAt: Date.now()

    });

}

export function watchComments(postId, container) {

    onValue(ref(database, `posts/${postId}/comments`), snapshot => {

        const data = snapshot.val();

        container.innerHTML = "";

        if (!data) return;

        Object.values(data).forEach(comment => {

            container.innerHTML += `
                <div class="comment">

                    <b>${comment.username}</b><br>

                    ${comment.text}

                </div>
            `;

        });

    });

}
