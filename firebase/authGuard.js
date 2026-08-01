import { auth } from "./firebase.js";


import {
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const page =
window.location.pathname;



const publicPages = [

"login.html",

"signup.html"

];



const isPublic =
publicPages.some(
(item)=>
page.includes(item)
);



onAuthStateChanged(
auth,
(user)=>{


console.log(
"Current Firebase user:",
user
);


document
.getElementById("authLoading")
?.remove();



if(!user && !isPublic){


window.location.replace(
"login.html"
);


}



if(user && isPublic){


window.location.replace(
"feed.html"
);


}


});
