import { KeyboardAvoidingView, StyleSheet, TextInput, Button, Text, View } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthenticationContext } from "../../../services/authentication.context";
import { LoginScreen } from '../../login/screens/login.screen';



export const CreateUserScreen = ( {navigation} ) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [duplicatePassword, setDuplicatePassword] = useState('')

  
  const { createNewUser, error, isLoading } = useContext(AuthenticationContext);

  
  const handleCreateUserPress = () => {
    try {
      
      navigation.navigate("Login");
      console.log("should be navigating");
    } catch (error) {
      console.error(error);
    }
  };
  
  
  

  return (
    <>
    <Text>CREATE USER SCREEN</Text>
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
        <TextInput
          placeholder="duplicatePassword"
          value={duplicatePassword}
          onChangeText={text => setDuplicatePassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <Text>in between</Text>
      <View style={styles.buttonContainer}>
        {!isLoading ? (
        <Button
        title="Create New User"
        onPress={() => createNewUser(email, password, duplicatePassword).then(() => {
          handleCreateUserPress();
        })}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Button>
        ): (
          <Text>no button</Text>
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
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})

