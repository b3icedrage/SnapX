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


const button =
document.getElementById("signupBtn");


button.onclick = async()=>{


const username =
document.querySelector("#username").value;


const email =
document.querySelector("#email").value;


const password =
document.querySelector("#password").value;



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

username: username,

email: email,

bio:"New Snap X creator 🚀"

}

);



alert("Welcome to Snap X 🎉");


}

catch(error){

alert(error.message);

}


};
