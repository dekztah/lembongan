// Conveniently import this file anywhere to use db

import firebase from 'firebase/app';
import 'firebase/database';

export const db = firebase
  .initializeApp({
    projectId: 'lembongan-2f63b',
    databaseURL: 'https://lembongan-2f63b.firebaseio.com',
  })
  .database();
