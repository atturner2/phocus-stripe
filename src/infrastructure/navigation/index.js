import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./app.navigator";
import {createNewUser} from "./app.navigator"
import { AccountNavigator } from "./account.navigator";

import { AuthenticationContext } from "../../services/authentication.context";
import { AccountInfoNavigator } from "./account-info.navigator";

export const Navigation = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const { creatingNewUser } = useContext(AuthenticationContext);
  //creating new user shouldnt be here, only isloading, Ijust need to figure out the navigation
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator/>: <AccountNavigator />}
    </NavigationContainer>
  );
};