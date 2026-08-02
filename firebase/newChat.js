import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    get,
    onValue,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const list = document.getElementById("usersList");
const search = document.getElementById("searchUsers");

let users = [];

onAuthStateChanged(auth, user => {

    if (!user) return;

    onValue(ref(database, "users"), snapshot => {

        users = [];

        list.innerHTML = "";

        if (!snapshot.exists()) {

            list.innerHTML =
            "<p>No users found.</p>";

            return;

        }

        snapshot.forEach(child => {

            if (child.key === user.uid) return;

            users.push({

                uid: child.key,

                ...child.val()

            });

        });

        render(users);

    });

});

function render(data) {

    list.innerHTML = "";

    data.forEach(user => {

        const card =
        document.createElement("div");

        card.className =
        "message-card";

        card.innerHTML = `

<img
class="message-avatar"
src="${user.photo || "../assets/default-avatar.png"}">

<div class="message-info">

<div class="message-name">

${user.displayName || "Unknown"}

</div>

<div class="message-last">

Tap to start chatting

</div>

</div>

`;

        card.onclick =
        () => startChat(user.uid);

        list.appendChild(card);

    });

}

search.oninput = () => {

    const q =
    search.value.toLowerCase();

    render(

        users.filter(u =>

            (u.displayName || "")
            .toLowerCase()
            .includes(q)

        )

    );

};

async function startChat(otherUid) {

    const me = auth.currentUser.uid;

    const chatsRef = ref(database, "chats");

    const snap = await get(chatsRef);

    if (snap.exists()) {

        let existing = null;

        snap.forEach(chat => {

            const c = chat.val();

            if (
                c.participants &&
                c.participants[me] &&
                c.participants[otherUid]
            ) {

                existing = chat.key;

            }

        });

        if (existing) {

            location.href =
            "chat.html?chat=" + existing;

            return;

        }

    }

    const chatRef = push(chatsRef);

    await set(chatRef, {

        participants: {

            [me]: true,

            [otherUid]: true

        },

        lastMessage: "",

        updatedAt: Date.now()

    });

    location.href =
    "chat.html?chat=" + chatRef.key;

}
