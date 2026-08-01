import {
auth,
database
}
from "./firebase.js";


import {

createUserWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

ref,
set

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



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



await set(

ref(
database,
"users/" + result.user.uid
),

{

username:username,

email:email,

bio:"New Snap X creator 🚀",

avatar:"",

followers:0,

following:0

}

);



window.location.href =
"feed.html";


}

catch(error){

alert(error.message);

}


};
