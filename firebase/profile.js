import { auth, database } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { uploadMedia } from "../supabase/upload.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    document.getElementById("profileEmail").textContent = user.email;

    const snap = await get(
        ref(database, "users/" + user.uid)
    );

    if (!snap.exists()) {

        document.getElementById("profileName").textContent =
            user.email.split("@")[0];

        return;
    }

    const profile = snap.val();

    document.getElementById("profileName").textContent =
        profile.displayName ||
        user.email.split("@")[0];

    document.getElementById("displayName").value =
        profile.displayName || "";

    document.getElementById("bio").value =
        profile.bio || "";

    if (profile.photo) {

        document.getElementById("photoPreview").src =
            profile.photo;

    }

    document.getElementById("followers").textContent =
        profile.followers
            ? Object.keys(profile.followers).length
            : 0;

    document.getElementById("following").textContent =
        profile.following
            ? Object.keys(profile.following).length
            : 0;

});

document
.getElementById("photoInput")
.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    document.getElementById("photoPreview").src =
        URL.createObjectURL(file);

});

document
.getElementById("saveProfile")
.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    let photo = null;

    const file =
        document.getElementById("photoInput").files[0];

    if (file) {

        photo = await uploadMedia(file);

    }

    const updates = {

        displayName:
            document.getElementById("displayName").value,

        bio:
            document.getElementById("bio").value

    };

    if (photo) {

        updates.photo = photo;

    }

    await update(
        ref(database, "users/" + user.uid),
        updates
    );

    document.getElementById("profileName").textContent =
        updates.displayName;

    alert("Profile updated successfully 🚀");

});
