import { auth, database } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { uploadMedia } from "../supabase/upload.js";

export async function uploadPost(file, caption = "") {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        return false;
    }

    // Upload media to Supabase Storage
    const mediaUrl = await uploadMedia(file);

    if (!mediaUrl) {
        alert("Upload failed.");
        return false;
    }

    const type = file.type.startsWith("video/")
        ? "video"
        : "image";

    // Save post metadata in Firebase Realtime Database
    await push(ref(database, "posts"), {

        uid: user.uid,

        username:
            user.email,

        caption:
            caption,

        media:
            mediaUrl,

        type:
            type,

        likes:
            0,

        comments:
            0,

        createdAt:
            Date.now()

    });

    return true;
}
