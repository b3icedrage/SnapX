import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed =
document.getElementById("snapsFeed");

onValue(ref(database,"posts"),snapshot=>{

    feed.innerHTML="";

    if(!snapshot.exists()){

        feed.innerHTML="<h2>No videos yet.</h2>";

        return;

    }

    const videos=[];

    snapshot.forEach(item=>{

        const post=item.val();

        if(post.type==="video"){

            videos.push(post);

        }

    });

    videos.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));

    videos.forEach(post=>{

        const snap=document.createElement("section");

        snap.className="snap-page";

        snap.innerHTML=`

<video
class="snap-video"
src="${post.media}"
loop
muted
playsinline
preload="metadata">
</video>

<div class="snap-overlay">

<div class="snap-user">

<b>${post.username}</b>

<p>${post.caption||""}</p>

</div>

<div class="snap-actions">

<button>❤️ ${post.likes||0}</button>

<button>💬 ${post.comments||0}</button>

<button>↗</button>

</div>

</div>

`;

        feed.appendChild(snap);

    });

});
