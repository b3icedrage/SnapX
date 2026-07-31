import { db, auth } from "./firebase.js";


import {
collection,
addDoc,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export async function createPost(text){


const user = auth.currentUser;


await addDoc(

collection(db,"posts"),

{

username:
user.email,

content:text,

likes:0,

createdAt:
serverTimestamp()

}

);


alert("Posted 🚀");


}
