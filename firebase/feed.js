import { db, auth } from "./firebase.js";


import {
collection,
getDocs,
query,
orderBy,
doc,
setDoc,
getDoc,
updateDoc,
increment
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const feed =
document.querySelector(".feed");



async function loadFeed(){


const q =
query(
collection(db,"posts"),
orderBy("createdAt","desc")
);



const snapshot =
await getDocs(q);



feed.innerHTML="";



snapshot.forEach((item)=>{


const post =
item.data();


const id =
item.id;



feed.innerHTML += `


<div class="post"
data-id="${id}">


${

post.type?.startsWith("video")

?

`
<video
class="post-media"
src="${post.media}"
controls>
</video>
`

:

`
<img
class="post-media"
src="${post.media}">
`

}



<div class="post-info">

<h3>
${post.username}
</h3>


<p>
${post.caption || ""}
</p>


</div>



<div class="actions">


<button class="like"
data-id="${id}">

❤️
<span>
${post.likes || 0}
</span>

</button>



<button class="comment-btn"
data-id="${id}">
💬
</button>


<button>
📤
</button>


</div>


</div>


`;



});



addLikeEvents();


}



function addLikeEvents(){


document
.querySelectorAll(".like")
.forEach(button=>{


button.onclick=async()=>{


const postId =
button.dataset.id;



const postRef =
doc(db,"posts",postId);



await updateDoc(
postRef,
{

likes:
increment(1)

}
);



let count =
button.querySelector("span");


count.innerHTML =
Number(count.innerHTML)+1;



button.classList.add(
"liked"
);



};



});



}

document.addEventListener(
"dblclick",
(e)=>{


const post =
e.target.closest(".post");


if(!post) return;



const heart =
document.createElement("div");


heart.className="big-heart";


heart.innerHTML="❤️";


post.appendChild(heart);



setTimeout(()=>{

heart.remove();

},800);


});

loadFeed();

import {
addComment
}
from "./comments.js";



document
.addEventListener(
"click",
(e)=>{


if(
e.target.classList.contains(
"comment-btn"
)
){


let postId =
e.target.dataset.id;



let text =
prompt(
"Write a comment"
);



if(text){

addComment(
postId,
text
);

}


}


});
