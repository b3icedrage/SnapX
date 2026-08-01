import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUHqqIqzu73SlP5uHR16kCbwQKeFRt7aY",
  authDomain: "snap-x-c737f.firebaseapp.com",
  databaseURL: "https://snap-x-c737f-default-rtdb.firebaseio.com",
  projectId: "snap-x-c737f",
  storageBucket: "snap-x-c737f.firebasestorage.app",
  messagingSenderId: "327958989341",
  appId: "1:327958989341:web:4aefa4dbef1cc67be454f4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
