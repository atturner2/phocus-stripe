import {  signOut } from "firebase/auth";
import { auth } from "../../firebase.js"
import { loginRequest, createUserRequest, logOutOfPhocus } from "./authentication.service";
import { Text, Alert } from "react-native";

import React, { useState, createContext } from "react";

export const AuthenticationContext = createContext();


export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [creatingNewUser, setCreatingNewUser] = useState(false);
 
  const handleSignUp = (email, password) => {
    console.log("REGISTERING")
    //call the error checkers here with ALL of the user input info
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log('Registering user: ', user);

        setUser(userCredentials);
        console.log('Registered with:', user);
        
      })
      .catch(error => alert(error.message));
  };

  //this will just check the passwords for now
  const validateNewUser = (password, duplicatePassword) => {
    if(password === duplicatePassword) {
      return;
    } else {
      Alert.alert("Passwords must match");
    }
  };

  const createNewUser = async (email, password, duplicatePassword) => {
    validateNewUser(password, duplicatePassword);
    //validate passwords are equal
    setCreatingNewUser(true);
    setIsLoading(true);
    createUserRequest(email, password)
      .then(() => {
        console.log("In the create user, UPDATINGcalling handleSignUp");
        //handleSignUp(email, password)
        console.log("In the create user, after HandleSIgnup");
        setCreatingNewUser(false);
        setIsLoading(false);
        console.log("In the create user, after HandleSIgnup");

      })
      .catch((error) => {
        console.log("error switching to the create user screen");
        setCreatingNewUser(false);
        setIsLoading(false);
        
        setError(error);

      });
    
    };

 const handleLogin = (email, password) => {
    console.log("LOGGING IN")
    setIsLoading(true);
    console.log("Here is user: ", user)
    loginRequest(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        setIsAuthenticated(true);
        console.log('Logged in with:', u);
      })
      .catch((error) => {
        console.log("we had an error: ", error);
        setIsLoading(false);
        setIsAuthenticated(false);
        setError(error);
      });
  };
  //this needs to be handled here unless we pass the context to the service,
  //might change that later it just takes some screwing around
  const handleLogout = () => {
    setIsLoading(true);
    console.log("LOGGING OUT!");
    signOut(auth)
      .then((u) => {
        setUser(null);
        setIsLoading(false);
        setIsAuthenticated(false);
      });
  }
  return (
    <AuthenticationContext.Provider
      
      value={{
        user,
        isAuthenticated,
        isLoading,
        creatingNewUser,
        error,
        handleLogin,
        handleLogout,
        createNewUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );

};


