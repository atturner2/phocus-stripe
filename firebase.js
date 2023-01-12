import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALbtPBoSy1vS6etkkDQuU-cahpRFF9eB4",
  authDomain: "phocus-f7cec.firebaseapp.com",
  projectId: "phocus-f7cec",
  storageBucket: "phocus-f7cec.appspot.com",
  messagingSenderId: "120304005512",
  appId: "1:120304005512:web:cdd91f2aea76efcd5e0a3d",
  measurementId: "G-S415MFZWLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)

export { auth };