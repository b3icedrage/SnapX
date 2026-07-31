import {
auth
} from "./firebase.js";


import {
createUserWithEmailAndPassword
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


document
.getElementById("signupBtn")
.onclick = async()=>{


let email =
document.querySelector(
"input[type=email]"
).value;


let password =
document.querySelector(
"input[type=password]"
).value;


try{


await createUserWithEmailAndPassword(
auth,
email,
password
);


alert("Account created 🚀");


}


catch(error){

alert(error.message);

}


};
