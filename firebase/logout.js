import { auth } from "./firebase.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function logout() {

    try {

        await signOut(auth);

        window.location.replace("../pages/login.html");

    } catch (error) {

        console.error(error);

        alert("Logout failed.");

    }

}
