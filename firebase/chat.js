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
let otherUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    currentUser = user;

    if (!chatId) {

        chatMessages.innerHTML =
            "<p>Conversation not found.</p>";

        return;

    }

    // Load chat information
    const chatSnap =
        await get(ref(database, "chats/" + chatId));

    if (chatSnap.exists()) {

        const chat = chatSnap.val();

        const otherUid =
            Object.keys(chat.participants)
            .find(uid => uid !== user.uid);

        if (otherUid) {

            const profileSnap =
                await get(
                    ref(database, "users/" + otherUid)
                );

            if (profileSnap.exists()) {

                otherUser = profileSnap.val();

                chatUser.textContent =
                    otherUser.displayName ||
                    "Unknown User";

            } else {

                chatUser.textContent =
                    "Unknown User";

            }

        }

    }

    loadMessages();

});

function loadMessages() {

    onValue(
        ref(database, "messages/" + chatId),
        async (snapshot) => {

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

            for (const message of messages) {

                // Mark received messages as read
                if (
                    message.sender !== currentUser.uid &&
                    !message.seen
                ) {

                    await update(
                        ref(
                            database,
                            "messages/" +
                            chatId +
                            "/" +
                            message.id
                        ),
                        {
                            seen: true
                        }
                    );

                }

                const row =
                    document.createElement("div");

                row.className =
                    message.sender === currentUser.uid
                        ? "chat-row sent-row"
                        : "chat-row received-row";

                // Avatar
                if (message.sender !== currentUser.uid) {

                    const avatar =
                        document.createElement("img");

                    avatar.className =
                        "chat-avatar";

                    avatar.src =
                        otherUser?.photo ||
                        "../assets/default-avatar.png";

                    row.appendChild(avatar);

                }

                const bubble =
                    document.createElement("div");

                bubble.className =
                    "message " +
                    (
                        message.sender === currentUser.uid
                            ? "sent"
                            : "received"
                    );

                bubble.innerHTML = `

<div class="message-text">

${message.text}

</div>

<div class="message-time">

${new Date(message.createdAt).toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})}

${
message.sender===currentUser.uid
?
`<span class="read-status">

${message.seen ? "✓✓" : "✓"}

</span>`
:
""
}

</div>

`;

                row.appendChild(bubble);

                chatMessages.appendChild(row);

            }

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        }

    );

}

sendBtn.onclick = async () => {

    if (!currentUser) return;

    const text =
        messageInput.value.trim();

    if (!text) return;

    await push(
        ref(database, "messages/" + chatId),
        {

            sender:
                currentUser.uid,

            text:

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

        e.preventDefault();

        sendBtn.click();

    }

});
