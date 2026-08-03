import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const image = document.getElementById("storyImage");
const video = document.getElementById("storyVideo");

const avatar = document.getElementById("storyAvatar");
const username = document.getElementById("storyUsername");
const storyTime = document.getElementById("storyTime");
const progress = document.getElementById("storyProgress");

const close = document.getElementById("closeStory");

async function loadStory() {

    if (!id) {

        alert("Invalid story.");

        history.back();

        return;

    }

    try {

        const snap = await getDoc(doc(db, "stories", id));

        if (!snap.exists()) {

            alert("Story not found");

            history.back();

            return;

        }

        const story = snap.data();

        avatar.src =
            story.photo ||
            "../assets/default-avatar.png";

        username.textContent =
            story.username || "Snap X User";

        if (story.createdAt) {

            storyTime.textContent =
                new Date(story.createdAt).toLocaleString();

        } else {

            storyTime.textContent = "Just now";

        }

        progress.innerHTML = `
            <div class="story-bar">
                <div class="story-fill" id="storyFill"></div>
            </div>
        `;

        requestAnimationFrame(() => {

            const fill =
                document.getElementById("storyFill");

            if (fill) {

                fill.style.transition = "width 5s linear";

                fill.style.width = "100%";

            }

        });

        if (
            story.type &&
            story.type.startsWith("video")
        ) {

            image.hidden = true;

            video.hidden = false;

            video.src = story.media;

            video.load();

            video.play().catch(() => {});

        } else {

            video.pause();

            video.hidden = true;

            image.hidden = false;

            image.src = story.media;

        }

    }

    catch (err) {

        console.error(err);

        alert("Failed to load story.");

    }

}

close.onclick = () => {

    history.back();

};

loadStory();
