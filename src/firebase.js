import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyBzBYJx3eLytBelVWqpfBJebMLQGbRbAe4",
  authDomain: "gcc-pagespeed-firebase.firebaseapp.com",
  databaseURL: "https://gcc-pagespeed-firebase.firebaseio.com",
  projectId: "gcc-pagespeed-firebase",
  storageBucket: "gcc-pagespeed-firebase.appspot.com",
  messagingSenderId: "149358079983"
};

firebase.initializeApp(config);

export default firebase;