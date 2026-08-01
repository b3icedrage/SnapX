import { auth } from "./firebase.js";

import {
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


console.log("Snap X starting...");


onAuthStateChanged(auth,(user)=>{


console.log(
"Auth check:",
user
);



if(user){


window.location.replace(
"pages/feed.html"
);


}else{


window.location.replace(
"pages/login.html"
);


}



});
