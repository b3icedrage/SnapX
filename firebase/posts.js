import { auth, database } from "./firebase.js";

import {
  ref,
  push,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export async function createPost(mediaUrl, type, caption = "") {

  const user = auth.currentUser;

  if (!user) {
    alert("Please login first.");
    return;
  }

  await push(ref(database, "posts"), {
    uid: user.uid,
    username: user.email,
    media: mediaUrl,
    type: type,
    caption: caption,
    likes: 0,
    createdAt: Date.now()
  });

  alert("Posted successfully 🚀");
}
