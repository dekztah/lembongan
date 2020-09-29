import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/analytics";

firebase.initializeApp({
  apiKey: "AIzaSyCit0Iw8xH_Nnk6uh_VxuZADmmwHjiwKj4",
  projectId: "lembongan-2f63b",
  databaseURL: "https://lembongan-2f63b.firebaseio.com",
  appId: "1:291839214173:web:7de55500e8cb1bea5d43b4"
});

const auth = firebase.auth();
const db = firebase.database();
firebase.analytics();

export { db, auth };
