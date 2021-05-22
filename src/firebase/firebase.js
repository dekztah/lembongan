import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/analytics";
import "firebase/storage";

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

firebase.analytics();

export { db, auth, storage };
