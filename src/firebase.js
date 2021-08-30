import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAvQiA8rdlz1AybagKxKy0E6wQL0Pj3U0s",
  authDomain: "slack-react-clone-9daca.firebaseapp.com",
  databaseURL: "https://slack-react-clone-9daca-default-rtdb.firebaseio.com",
  projectId: "slack-react-clone-9daca",
  storageBucket: "slack-react-clone-9daca.appspot.com",
  messagingSenderId: "666092678143",
  appId: "1:666092678143:web:5309f5d0b02b803959d5ca",
  measurementId: "G-1TPKBVXFD6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;