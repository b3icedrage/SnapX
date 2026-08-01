import { db } from "./firebase.js";

import {
collection,
getDocs,
query,
orderBy
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const feedContainer = document.querySelector(".feed");


async function loadPosts(){

try{

const q = query(
collection(db,"posts"),
orderBy("createdAt","desc")
);


const snapshot = await getDocs(q);


feedContainer.innerHTML="";


snapshot.forEach((doc)=>{


const post = doc.data();


feedContainer.innerHTML += `

<div class="post">


<strong>
${post.username}
</strong>


${
post.type?.startsWith("video")

?

`
<video class="post-media" controls>
<source src="${post.media}">
</video>
`

:

`
<img 
class="post-media"
src="${post.media}">
`

}



<div class="actions">

<button>
❤️ ${post.likes || 0}
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
catch(error){

console.log(error);

}


}


loadPosts();
