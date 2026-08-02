import { auth, database } from "./firebase.js";

import {
    ref,
    push,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { uploadMedia } from "../supabase/upload.js";

export async function uploadPost(file, caption = "") {

    const user = auth.currentUser;

    if (!user) {

        alert("Please login first.");

        return false;

    }

    // Upload image/video to Supabase
    const mediaUrl = await uploadMedia(file);

    if (!mediaUrl) {

        alert("Upload failed.");

        return false;

    }

    // Load user's profile from Firebase
    let displayName = user.email;
    let photo = "../assets/default-avatar.png";

    const profileSnap = await get(
        ref(database, "users/" + user.uid)
    );

    if (profileSnap.exists()) {

        const profile = profileSnap.val();

        displayName =
            profile.displayName ||
            user.email;

        photo =
            profile.photo ||
            "../assets/default-avatar.png";

    }

    const type =
        file.type.startsWith("video/")
        ? "video"
        : "image";

    await push(
        ref(database, "posts"),
        {

            uid: user.uid,

            username: displayName,

            photo: photo,

            caption: caption,

            media: mediaUrl,

            type: type,

            likes: 0,

            comments: 0,

            createdAt: Date.now()

        }
    );

    return true;

}
