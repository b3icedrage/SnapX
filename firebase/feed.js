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

<div class="post-header">

<strong>${post.username}</strong>

<span>Snap X</span>

</div>


<div class="post-content">

${post.content}

</div>


<div class="actions">

<button class="like-btn">
❤️ ${post.likes || 0}
</button>

<button>
💬 Comment
</button>

<button>
📤 Share
</button>

</div>

</div>

`;

});


}
catch(error){

console.log(error);

}


}


loadPosts();
