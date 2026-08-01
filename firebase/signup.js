import { auth, db } from "./firebase.js";


import {

createUserWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

doc,

setDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



document
.getElementById("signupBtn")
.onclick = async()=>{


const username =
document.getElementById("username").value;


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;



try{


const result =

await createUserWithEmailAndPassword(

auth,

email,

password

);



await setDoc(

doc(
db,
"users",
result.user.uid
),

{

username,

email,

bio:
"New Snap X creator 🚀",

avatar:""

}

);



window.location.href =
"feed.html";


}

catch(error){

alert(error.message);

}


};
