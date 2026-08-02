import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    onValue,
    push,
    update,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const chatId = params.get("chat");

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatUser = document.getElementById("chatUser");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    currentUser = user;

    if (!chatId) {

        chatMessages.innerHTML =
        "<p>Conversation not found.</p>";

        return;

    }

    // Load chat header
    const chatSnap =
        await get(ref(database, "chats/" + chatId));

    if (chatSnap.exists()) {

        const chat = chatSnap.val();

        const otherUid =
            Object.keys(chat.participants)
            .find(uid => uid !== user.uid);

        if (otherUid) {

            const profileSnap =
                await get(ref(database, "users/" + otherUid));

            if (profileSnap.exists()) {

                const profile = profileSnap.val();

                chatUser.textContent =
                    profile.displayName || "Unknown";

            }

        }

    }

    loadMessages();

});

function loadMessages() {

    onValue(
        ref(database, "messages/" + chatId),
        snapshot => {

            chatMessages.innerHTML = "";

            if (!snapshot.exists()) {

                chatMessages.innerHTML =
                "<p>No messages yet.</p>";

                return;

            }

            const messages = [];

            snapshot.forEach(child => {

                messages.push({

                    id: child.key,

                    ...child.val()

                });

            });

            messages.sort(
                (a, b) =>
                (a.createdAt || 0) -
                (b.createdAt || 0)
            );

            messages.forEach(message => {

                const bubble =
                    document.createElement("div");

                bubble.className =
                    "message " +

                    (message.sender === currentUser.uid
                        ? "sent"
                        : "received");

                bubble.textContent =
                    message.text;

                chatMessages.appendChild(bubble);

            });

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }

    );

}

sendBtn.onclick = async () => {

    const text =
        messageInput.value.trim();

    if (!text) return;

    await push(
        ref(database, "messages/" + chatId),
        {

            sender:
                currentUser.uid,

            text,

            createdAt:
                Date.now(),

            seen:
                false

        }

    );

    await update(
        ref(database, "chats/" + chatId),
        {

            lastMessage:
                text,

            updatedAt:
                Date.now()

        }

    );

    messageInput.value = "";

};

messageInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        sendBtn.click();

    }

});
