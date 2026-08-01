import { db, auth } from "./firebase.js";


import {
collection,
addDoc,
query,
where,
getDocs,
orderBy,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



export async function addComment(postId,text){


const user =
auth.currentUser;


if(!user){
alert("Login first");
return;
}



await addDoc(
collection(db,"comments"),
{

postId:postId,

userId:user.uid,

username:user.email,

text:text,

createdAt:
serverTimestamp()

}

);


alert("Comment added 💬");


}





export async function loadComments(postId){


const q =
query(

collection(db,"comments"),

where(
"postId",
"==",
postId
),

orderBy(
"createdAt",
"asc"
)

);



const snapshot =
await getDocs(q);



let comments=[];


snapshot.forEach(doc=>{

comments.push(
doc.data()
);

});


return comments;


}
