
import {  Button, Text, StyleSheet} from 'react-native';
import { AuthenticationContext } from "../../../services/authentication.context";
import {React, useContext} from "react";



export const AccountInfoScreen = () => {
  return (
    <>
    <Text>Here we should have account information.  This is where we should handle stripe billing</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />

    </>
  );
};
   
   
   
  

const styles = StyleSheet.create({
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
  });
  