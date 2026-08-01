import { auth } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const page = window.location.pathname;

const isPublic =
page.endsWith("login.html") ||
page.endsWith("signup.html");

onAuthStateChanged(auth, (user) => {

  console.log("Current Firebase user:", user);

  document.getElementById("checking")?.remove();

  if (user) {

    // If already logged in and on login/signup,
    // go to the feed.
    if (isPublic) {
      window.location.replace("feed.html");
    }

    // Otherwise stay on the current protected page.
    return;
  }

  // Not logged in
  if (!isPublic) {
    window.location.replace("login.html");
  }

});
