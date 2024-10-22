// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdTm41jhUJgPGBGji18dfA6BOOqQ4SUAE",
  authDomain: "wloof-8dc31.firebaseapp.com",
  databaseURL: "https://wloof-8dc31-default-rtdb.firebaseio.com",
  projectId: "wloof-8dc31",
  storageBucket: "wloof-8dc31.appspot.com",
  messagingSenderId: "72455507594",
  appId: "1:72455507594:web:a01b10cf6467185874a773",
  measurementId: "G-JN9XSWWY5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {database}