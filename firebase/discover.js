import { database } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const feed =
document.getElementById("discoverFeed");

onValue(
ref(database,"posts"),
(snapshot)=>{

feed.innerHTML="";

if(!snapshot.exists()){

feed.innerHTML="<p>No posts yet.</p>";

return;

}

const posts=[];

snapshot.forEach(post=>{

posts.push({

id:post.key,

...post.val()

});

});

posts.sort((a,b)=>{

const likesA=a.likes||0;
const likesB=b.likes||0;

if(likesA===likesB){

return b.createdAt-a.createdAt;

}

return likesB-likesA;

});

posts.forEach(post=>{

const card=document.createElement("div");

card.className="post";

const media=
post.type==="video"

?

`<video
class="uploaded-media"
src="${post.media}"
controls
playsinline>
</video>`

:

`<img
class="uploaded-media"
src="${post.media}">`;

card.innerHTML=`

${media}

<div class="post-content">

<b>${post.username}</b>

<p>${post.caption||""}</p>

<div class="actions">

<button>
❤️ ${post.likes||0}
</button>

<button>
💬 ${post.comments||0}
</button>

</div>

</div>

`;

feed.appendChild(card);

});

});
