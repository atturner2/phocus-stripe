import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { auth } from "../../firebase.js";

export const loginRequest = (email, password) => 
   signInWithEmailAndPassword(auth, email, password);

export const createUserRequest = (email, password) =>
   createUserWithEmailAndPassword(auth, email, password);




