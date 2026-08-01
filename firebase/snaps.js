import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const snapsContainer =
document.querySelector(".snaps-container");



async function loadSnaps(){


const q =
query(
collection(db,"posts"),
orderBy("createdAt","desc")
);



const snapshot =
await getDocs(q);



snapsContainer.innerHTML="";



snapshot.forEach((doc)=>{


const post =
doc.data();



if(
post.type &&
post.type.startsWith("video")
){


snapsContainer.innerHTML += `


<div class="snap">


<video
class="snap-video"
src="${post.media}"
loop
playsinline
autoplay
muted>
</video>


<div class="snap-info">

<h3>
${post.username}
</h3>

<p>
Snap X Short Video 🚀
</p>

</div>


<div class="snap-actions">

<button>
❤️
</button>


<button>
💬
</button>


<button>
📤
</button>


</div>


</div>


`;

}


});



observeVideos();


}



function observeVideos(){


const videos =
document.querySelectorAll(".snap-video");



const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){

entry.target.play();

}

else{

entry.target.pause();

}


});


},
{
threshold:.7
}
);



videos.forEach(video=>{

observer.observe(video);

});


}



loadSnaps();
