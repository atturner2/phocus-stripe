import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthenticationContext } from "../../../services/authentication.context";
import { LoadingComponent } from "../../Loading/loading-component";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, error, isLoading } = useContext(AuthenticationContext);

  return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.centerContainer}>
          <Text style={styles.centerText}>Phocus.</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
          />
          <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
          />
        </View>
        <View style={styles.buttonContainer}>
          {!isLoading ? (
              <>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLogin(email, password)}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("CreateUser")}
                >
                  <Text style={styles.buttonText}>Create User</Text>
                </TouchableOpacity>
              </>
          ) : (
              <LoadingComponent></LoadingComponent>
          )}
        </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'limegreen',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    color: 'black',
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: 'limegreen',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
});
