import { db } from "./firebase.js";

import {
doc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params =
new URLSearchParams(location.search);

const id =
params.get("id");

const image =
document.getElementById("storyImage");

const video =
document.getElementById("storyVideo");

const user =
document.getElementById("storyUser");

const close =
document.getElementById("closeStory");

async function loadStory(){

    const snap =
    await getDoc(
        doc(db,"stories",id)
    );

    if(!snap.exists()){

        alert("Story not found");

        history.back();

        return;

    }

    const story =
    snap.data();

    user.textContent =
    story.username;

    if(story.type.startsWith("video")){

        video.src =
        story.media;

        video.style.display="block";

    }

    else{

        image.src =
        story.media;

        image.style.display="block";

    }

}

close.onclick=()=>{

history.back();

};

loadStory();
