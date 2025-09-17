// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB99Lsy4aMlE3AIqXh9B-HczForN57_X_w",
  authDomain: "task-manager-e9781.firebaseapp.com",
  projectId: "task-manager-e9781",
  storageBucket: "task-manager-e9781.firebasestorage.app",
  messagingSenderId: "812331961115",
  appId: "1:812331961115:web:e8cc31e642ff79e28d21be",
  measurementId: "G-CNMVTE2WZW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);