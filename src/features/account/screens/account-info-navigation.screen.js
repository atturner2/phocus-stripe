import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountScreen } from "./account.screen";
import { AccountInfoScreen } from "./account-info.screen";
const AccountStack = createStackNavigator();

export const AccountInfoScreens = () => (
  <AccountStack.Navigator>
    <AccountStack.Screen name="Account" component={AccountScreen}/>
    <AccountStack.Screen name="AccountInfo" component={AccountInfoScreen}/>
  </AccountStack.Navigator>
);
