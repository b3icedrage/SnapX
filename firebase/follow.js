import {
db,
auth
}
from "./firebase.js";


import {

addDoc,

collection,

serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



export async function followUser(userId){


const current =
auth.currentUser;


if(!current)return;



await addDoc(

collection(
db,
"followers"
),

{

followerId:
current.uid,


followingId:
userId,


createdAt:
serverTimestamp()

}

);



alert(
"Following 🚀"
);


}
