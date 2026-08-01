import { supabase } from "./client.js";

import { db, auth } from "../firebase/firebase.js";

import {
collection,
addDoc,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


export async function uploadMedia(file){

if(!file) return null;


const cleanName =
file.name.replace(/[^a-zA-Z0-9.-]/g,"_");


const filePath =
`uploads/${Date.now()}_${cleanName}`;


const {error} =
await supabase
.storage
.from("snap-media")
.upload(filePath,file);


if(error){

console.error(error);
return null;

}



const url =
supabase
.storage
.from("snap-media")
.getPublicUrl(filePath)
.data
.publicUrl;



const user =
auth.currentUser;



await addDoc(
collection(db,"posts"),
{

username:
user?.email || "Snap X User",

media:url,

type:file.type,

likes:0,

createdAt:
serverTimestamp()

}

);



return url;


}
