import firebase from 'firebase';
// require('dotenv').config();

var config = {
  apiKey: process.env.clientId,
  authDomain: process.env.clientId,
  databaseURL: process.env.clientId,
  projectId: process.env.clientId,
  storageBucket: "air-bender-chat.appspot.com",
  messagingSenderId: process.env.clientId
};
firebase.initializeApp(config);
export default firebase;
