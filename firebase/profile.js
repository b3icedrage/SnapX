import { auth, database } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function loadProfile() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) return;

        const snap = await get(
            ref(database, "users/" + user.uid)
        );

        if (!snap.exists()) return;

        const profile = snap.val();

        document.getElementById("displayName").value =
            profile.displayName || "";

        document.getElementById("bio").value =
            profile.bio || "";

        document.getElementById("photoPreview").src =
            profile.photo || "../assets/default-avatar.png";

    });

}

export async function saveProfile(photoUrl = null) {

    const user = auth.currentUser;

    if (!user) return;

    const updates = {

        displayName:
            document.getElementById("displayName").value,

        bio:
            document.getElementById("bio").value

    };

    if (photoUrl) {
        updates.photo = photoUrl;
    }

    await update(
        ref(database, "users/" + user.uid),
        updates
    );

    alert("Profile updated successfully 🚀");

}
