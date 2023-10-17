import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountScreen } from "./account.screen";
import { AccountInfoScreen } from "./account-info.screen";
import { SubscriptionScreen } from "../../subscription/subscription-screen";
const AccountStack = createStackNavigator();

export const AccountInfoScreens = () => (
  <AccountStack.Navigator screenOptions={{ headerShown: false }}>
    <AccountStack.Screen name="AccountStuff" component={AccountScreen}/>
    <AccountStack.Screen name="SubscriptionScreen" component={SubscriptionScreen}/>
  </AccountStack.Navigator>
);
