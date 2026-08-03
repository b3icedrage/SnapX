import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, auth } from "./firebase.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const storiesContainer =
document.getElementById("stories");

const DAY =
24 * 60 * 60 * 1000;

/* ==========================
   Load Stories
========================== */

function loadStories(){

    const yesterday =
    Date.now() - DAY;

    const q =
    query(
        collection(db,"stories"),
        where("createdAt",">",yesterday),
        orderBy("createdAt","desc")
    );

    onSnapshot(q,(snapshot)=>{

        storiesContainer.innerHTML="";

        renderMyStory();

        snapshot.forEach((doc)=>{

    const story = {

        id: doc.id,

        ...doc.data()

            if(
                auth.currentUser &&
                story.uid === auth.currentUser.uid
            ){
                return;
            }

            renderStory(story);

        });

    });

}

/* ==========================
   Your Story
========================== */

function renderMyStory(){

    const me =
    auth.currentUser;

    const avatar =
    me?.photoURL ||
    "../assets/default-avatar.png";

    storiesContainer.innerHTML += `

<div id="myStory" class="story add-story">
<div class="story-ring">

<img
src="${avatar}"
class="story-avatar">

<div class="add-story-badge">

+

</div>

</div>

<span>

Your Story

</span>

</div>

`;

}

/* ==========================
   Story Card
========================== */

function renderStory(story){

    const ringClass =
    story.verified
        ? "story-ring verified-story"
        : "story-ring active-story";

    storiesContainer.innerHTML += `

<div
class="story"
data-id="${story.id || ""}">

<div class="${ringClass}">

<img
src="${story.photo || "../assets/default-avatar.png"}"
class="story-avatar">

</div>

<span>

${story.username || "User"}

</span>

</div>

`;

}
const storage = getStorage();

document.addEventListener("click", (e) => {

    const myStory = e.target.closest("#myStory");

    if (!myStory) return;

    const picker = document.createElement("input");

    picker.type = "file";

    picker.accept = "image/*,video/*";

    picker.onchange = async () => {

        const file = picker.files[0];

        if (!file) return;

        try {

            const fileRef = storageRef(
                storage,
                "stories/" + Date.now() + "_" + file.name
            );

            await uploadBytes(fileRef, file);

            const url = await getDownloadURL(fileRef);

            await addDoc(collection(db, "stories"), {

                uid: auth.currentUser.uid,

                username:
                    auth.currentUser.displayName || "User",

                photo:
                    auth.currentUser.photoURL ||
                    "../assets/default-avatar.png",

                media: url,

                type: file.type,

                verified: false,

                createdAt: Date.now()

            });

            alert("✅ Story uploaded!");

        } catch (err) {

            console.error(err);

            alert("Failed to upload story.");

        }

    };

    picker.click();

});

loadStories();

