import { KeyboardAvoidingView, StyleSheet, TextInput, Button, Text, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthenticationContext } from "../../../services/authentication.context";
import { AuthButton } from "../component/login.component"
import {LoadingComponent} from "../../Loading/loading-component";

export const LoginScreen = ( {navigation} ) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {  handleLogin, error, isLoading } = useContext(AuthenticationContext);



  return (
    <>
    <KeyboardAvoidingView
    style = {styles.container}
    behavior = "padding"
    >
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
        <Button
          title="Login"
          onPress={() => handleLogin(email, password)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Button>
        <Button
        title="Create User"
        onPress={() => navigation.navigate("CreateUser")}
        style={styles.button}
      >

        <Text style={styles.buttonText}>Login</Text>
      </Button>
      </>
        ): (
            <LoadingComponent></LoadingComponent>
        ) }

      </View>
    </KeyboardAvoidingView>
    </>
  )
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  inputContainer: {
    width: '80%',
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
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'limegreen',
    borderWidth: 2,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: 'limegreen',
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'limegreen', // Set header background color to lime green
    padding: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'black', // Set header text color to black
    fontWeight: '700',
    fontSize: 18,
  },
});

