import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCUCTuRneDbrIYsmW4PfUV3C3S0VqR5Ess",
    authDomain: "profepaco-ad6fb.firebaseapp.com",
    projectId: "profepaco-ad6fb",
    storageBucket: "profepaco-ad6fb.appspot.com",
    messagingSenderId: "1074433734479",
    appId: "1:1074433734479:web:bc898222c2581f2b1e373a",
    measurementId: "G-LYEVLC66HT"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;