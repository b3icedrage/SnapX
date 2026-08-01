import {db,auth} from "./firebase.js";


import {
doc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


auth.onAuthStateChanged(async(user)=>{


if(user){


const snap =
await getDoc(
doc(db,"users",user.uid)
);


const data=snap.data();


document
.getElementById("username")
.innerHTML=data.username;


document
.getElementById("bio")
.innerHTML=data.bio;


}


});

import { db, auth } from "./firebase.js";


import {
doc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



auth.onAuthStateChanged(async(user)=>{


if(!user) return;



const profile =
await getDoc(
doc(
db,
"users",
user.uid
)
);



if(profile.exists()){


const data =
profile.data();



document
.getElementById("profileName")
.innerHTML =
data.username;



document
.getElementById("bio")
.innerHTML =
data.bio;



if(data.avatar){


document
.getElementById("avatar")
.src =
data.avatar;


}



}



});
