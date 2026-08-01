import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // A user session exists on this device
    window.location.replace("pages/feed.html");
  } else {
    // No signed-in user on this device
    window.location.replace("pages/login.html");
  }
});
