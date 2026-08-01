import { auth } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("Auth guard loaded");

onAuthStateChanged(auth, (user) => {
  console.log("Auth state changed:", user);

  const overlay = document.getElementById("checking");
  if (overlay) {
    overlay.remove();
    console.log("Checking overlay removed");
  }

  const page = window.location.pathname;
  const isPublic =
    page.endsWith("login.html") ||
    page.endsWith("signup.html");

  if (!user && !isPublic) {
    console.log("Redirecting to login...");
    window.location.replace("login.html");
    return;
  }

  if (user && isPublic) {
    console.log("Redirecting to feed...");
    window.location.replace("feed.html");
  }
});
