import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { MyTabs } from './src/features/tabs/screens/tab.screen';
import { LoginScreen } from './src/features/login/screens/login.screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KeyboardAvoidingView,  TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react';
import { AuthenticationContextProvider } from "./src/services/authentication.context";
import { Navigation } from "./src/infrastructure/navigation";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    
    
    <AuthenticationContextProvider>
      <Navigation/>
    </AuthenticationContextProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
