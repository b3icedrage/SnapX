import { auth } from "./firebase.js";

import {
signInWithEmailAndPassword
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("loginBtn").onclick = async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("LOGIN SUCCESS", result.user);

    window.location.replace("feed.html");

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};
