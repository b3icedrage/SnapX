import { auth } from "./firebase.js";


import {
signOut
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



export function logout(){


signOut(auth);


window.location.href =
"../index.html";


}
