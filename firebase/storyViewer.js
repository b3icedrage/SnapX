import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================
   DOM
========================== */

const image =
document.getElementById("storyImage");

const video =
document.getElementById("storyVideo");

const avatar =
document.getElementById("storyAvatar");

const username =
document.getElementById("storyUsername");

const storyTime =
document.getElementById("storyTime");

const progress =
document.getElementById("storyProgress");

const closeBtn =
document.getElementById("closeStory");

/* ==========================
   URL PARAMS
========================== */

const params =
new URLSearchParams(location.search);

const storyId =
params.get("id");

/* ==========================
   STATE
========================== */

const DAY =
24 * 60 * 60 * 1000;

let stories = [];

let currentIndex = 0;

let timer = null;

let startY = 0;

/* ==========================
   LOAD STORIES
========================== */

async function loadStories(){

    const yesterday =
    Date.now() - DAY;

    const q =
    query(
        collection(db,"stories"),
        where("createdAt",">",yesterday),
        orderBy("createdAt","asc")
    );

    const snapshot =
    await getDocs(q);

    stories = [];

    snapshot.forEach(doc=>{

        stories.push({

            id:doc.id,

            ...doc.data()

        });

    });

    currentIndex =
    stories.findIndex(
        s=>s.id===storyId
    );

    if(currentIndex<0){

        currentIndex=0;

    }

    if(stories.length===0){

        alert("No stories found.");

        history.back();

        return;

    }

    loadStory(
        stories[currentIndex]
    );

}

/* ==========================
   CLOSE
========================== */

closeBtn.onclick=()=>{

    history.back();

};
/* ==========================
   LOAD SINGLE STORY
========================== */

function loadStory(story){

    clearTimeout(timer);

    image.hidden = true;

    video.hidden = true;

    video.pause();

    avatar.src =
    story.photo ||
    "../assets/default-avatar.png";

    username.textContent =
    story.username ||
    "Snap X User";


    storyTime.textContent =
    new Date(
        story.createdAt
    ).toLocaleTimeString();


    progress.innerHTML = `

    <div class="story-bar">

        <div
        class="story-fill"
        id="storyFill">
        </div>

    </div>

    `;


    if(
        story.type &&
        story.type.startsWith("video")
    ){

        video.src =
        story.media;

        video.hidden = false;

        video.currentTime = 0;

        video.play();


        video.onended = ()=>{

            nextStory();

        };


        startProgress(10);


    }

    else{


        image.src =
        story.media;

        image.hidden = false;


        image.onload = ()=>{

            startProgress(5);

        };


    }


}
/* ==========================
   STORY TIMER
========================== */

function startProgress(seconds){

    clearTimeout(timer);


    const fill =
    document.getElementById(
        "storyFill"
    );


    if(fill){

        fill.style.width="0%";


        setTimeout(()=>{

            fill.style.transition =
            `width ${seconds}s linear`;

            fill.style.width="100%";


        },50);

    }


    timer =
    setTimeout(()=>{

        nextStory();

    }, seconds * 1000);

}
/* ==========================
   NAVIGATION
========================== */

function nextStory(){

    if(
        currentIndex >= stories.length - 1
    ){

        history.back();

        return;

    }


    currentIndex++;

    loadStory(
        stories[currentIndex]
    );

}


function previousStory(){

    if(currentIndex <= 0){

        return;

    }


    currentIndex--;

    loadStory(
        stories[currentIndex]
    );

}
/* ==========================
   TAP CONTROLS
========================== */

document
.getElementById("nextStory")
.onclick = nextStory;


document
.getElementById("prevStory")
.onclick = previousStory;
loadStories();
/* ==========================
   VIEWED STORIES
========================== */

function markViewed(story){

    let viewed =
    JSON.parse(
        localStorage.getItem("viewedStories")
    ) || [];


    if(!viewed.includes(story.id)){

        viewed.push(story.id);


        localStorage.setItem(
            "viewedStories",
            JSON.stringify(viewed)
        );

    }

}


/* ==========================
   FADE TRANSITION
========================== */

function fadeMedia(){

    const media =
    document.querySelector(
        ".story-media"
    );


    media.style.opacity="0";


    setTimeout(()=>{

        media.style.opacity="1";

    },150);

}


/* ==========================
   PRELOAD NEXT STORY
========================== */

function preloadNext(){

    const next =
    stories[currentIndex + 1];


    if(!next) return;


    if(
        next.type &&
        next.type.startsWith("video")
    ){

        const v =
        document.createElement("video");

        v.src =
        next.media;

        v.preload="auto";

    }

    else{

        const img =
        new Image();

        img.src =
        next.media;

    }

}


/* ==========================
   SWIPE DOWN CLOSE
========================== */

let touchStart = 0;


document.addEventListener(
"touchstart",
(e)=>{

    touchStart =
    e.touches[0].clientY;

});


document.addEventListener(
"touchend",
(e)=>{

    const touchEnd =
    e.changedTouches[0].clientY;


    const distance =
    touchEnd - touchStart;


    if(distance > 120){

        history.back();

    }

});


/* ==========================
   CLEAN MEDIA SWITCH
========================== */

function resetMedia(){

    video.pause();

    video.removeAttribute(
        "src"
    );

    video.load();

    image.src="";

}


/* ==========================
   OVERRIDE STORY LOADING
========================== */

const oldLoadStory =
loadStory;


loadStory = function(story){

    resetMedia();

    fadeMedia();

    oldLoadStory(story);

    markViewed(story);

    preloadNext();

};
