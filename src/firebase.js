// Conveniently import this file anywhere to use db

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

firebase.initializeApp({
  apiKey: "AIzaSyCit0Iw8xH_Nnk6uh_VxuZADmmwHjiwKj4",
  projectId: "lembongan-2f63b",
  databaseURL: "https://lembongan-2f63b.firebaseio.com"
});

const auth = firebase.auth();
const db = firebase.database();

export { db, auth };
