import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const splash = document.querySelector(".splash");

onAuthStateChanged(auth, (user) => {

  if (splash) {
    splash.classList.add("fade-out");

    setTimeout(() => {
      if (user) {
        window.location.replace("pages/feed.html");
      } else {
        window.location.replace("pages/login.html");
      }
    }, 600);

  } else {

    if (user) {
      window.location.replace("pages/feed.html");
    } else {
      window.location.replace("pages/login.html");
    }

  }

});
