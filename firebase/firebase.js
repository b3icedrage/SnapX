// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUHqqIqzu73SlP5uHR16kCbwQKeFRt7aY",
  authDomain: "snap-x-c737f.firebaseapp.com",
  projectId: "snap-x-c737f",
  storageBucket: "snap-x-c737f.firebasestorage.app",
  messagingSenderId: "327958989341",
  appId: "1:327958989341:web:4aefa4dbef1cc67be454f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
