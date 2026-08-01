import { auth } from "./firebase.js";

import {
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const allowedPages = [
"login.html",
"signup.html"
];


const currentPage =
window.location.pathname.split("/").pop();



onAuthStateChanged(auth, (user)=>{


console.log(
"Firebase user:",
user
);



if(!user && !allowedPages.includes(currentPage)){


window.location.href =
"login.html";


}



if(user && allowedPages.includes(currentPage)){


window.location.href =
"feed.html";


}


});
