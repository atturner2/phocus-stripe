import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
