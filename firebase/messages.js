import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const list = document.getElementById("messagesList");
const search = document.getElementById("searchInput");

let allChats = [];

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    const chatsRef = ref(database, "chats");

    onValue(chatsRef, async (snapshot) => {

        list.innerHTML = "";
        allChats = [];

        if (!snapshot.exists()) {

            list.innerHTML = `
                <div class="empty-feed">
                    <h2>No conversations</h2>
                    <p>Start chatting with someone 🚀</p>
                </div>
            `;

            return;

        }

        const promises = [];

        snapshot.forEach(chatSnap => {

            const chat = chatSnap.val();

            if (!chat.participants || !chat.participants[user.uid]) {
                return;
            }

            const chatId = chatSnap.key;

            const otherUid = Object.keys(chat.participants)
                .find(uid => uid !== user.uid);

            if (!otherUid) return;

            promises.push((async () => {

                const userSnap = await get(ref(database, "users/" + otherUid));

                const profile = userSnap.exists() ? userSnap.val() : {};

                allChats.push({

                    id: chatId,

                    uid: otherUid,

                    name: profile.displayName || "Unknown User",

                    photo: profile.photo || "../assets/default-avatar.png",

                    lastMessage: chat.lastMessage || "No messages yet",

                    updatedAt: chat.updatedAt || 0

                });

            })());

        });

        await Promise.all(promises);

        allChats.sort((a, b) => b.updatedAt - a.updatedAt);

        renderChats(allChats);

    });

});

function renderChats(chats) {

    list.innerHTML = "";

    if (chats.length === 0) {

        list.innerHTML = `
            <div class="empty-feed">
                <h2>No matching conversations</h2>
            </div>
        `;

        return;

    }

    chats.forEach(chat => {

        const card = document.createElement("div");

        card.className = "message-card";

        card.innerHTML = `

<img
class="message-avatar"
src="${chat.photo}">

<div class="message-info">

<div class="message-name">

${chat.name}

</div>

<div class="message-last">

${chat.lastMessage}

</div>

</div>

<div class="message-time">

${new Date(chat.updatedAt).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
})}

</div>

`;

        card.onclick = () => {

            location.href =
                "chat.html?chat=" + chat.id;

        };

        list.appendChild(card);

    });

}

search.oninput = () => {

    const q = search.value.toLowerCase();

    renderChats(

        allChats.filter(chat =>

            chat.name.toLowerCase().includes(q)

        )

    );

};
