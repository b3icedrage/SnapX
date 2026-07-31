import {
db
} from "./firebase.js";


import {
collection,
addDoc,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export async function createPost(text){


await addDoc(
collection(db,"posts"),
{

username:"SnapX User",

content:text,

likes:0,

createdAt:serverTimestamp()

});


alert("Post uploaded 🚀");


}
