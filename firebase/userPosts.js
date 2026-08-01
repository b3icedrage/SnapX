import {db,auth} from "./firebase.js";


import {

collection,

getDocs,

query,

where

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



async function loadUserPosts(){


const user =
auth.currentUser;



if(!user)return;



const q =
query(

collection(db,"posts"),

where(
"username",
"==",
user.email
)

);



const snap =
await getDocs(q);



const box =
document.getElementById(
"userPosts"
);



snap.forEach(doc=>{


const post =
doc.data();



box.innerHTML += `


<img src="${post.media}">


`;


});


}



auth.onAuthStateChanged(
loadUserPosts
);
