import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../../features/login/screens/login.screen";
import { CreateUserScreen } from "../../features/createuser/screens/create-user.screen"
import { AccountInfoScreen } from "../../features/account/screens/account-info.screen";

const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen}/>
    <Stack.Screen name="CreateUser" component={CreateUserScreen}/>
  </Stack.Navigator>
);
