import {  Button, Text, StyleSheet} from 'react-native';
import { AuthenticationContext } from "../../../services/authentication.context";
import {React, useContext} from "react";
import { AccountInfoNavigator } from '../../../infrastructure/navigation/account-info.navigator';
import { SubscriptionScreen } from '../../subscription/subscription-screen';
export const AccountScreen = ( {navigation} ) => {
    const { handleLogout } = useContext(AuthenticationContext);

    return(
      <>

    <Button
  title="logout"
  onPress={() => handleLogout()}
  style={styles.button}
  >
  <Text style={styles.buttonText}>Logout</Text>
  </Button>
  <Button
  title="account info"
  onPress={() => navigation.navigate("AccountInfo")}
  style={styles.button}
  >
  <Text style={styles.buttonText}>Logout</Text>
  </Button>
  <Button
  title="subscription"
  onPress={() => navigation.navigate("SubscriptionScreen")}
  style={styles.button}
  >
  <Text style={styles.buttonText}>Logout</Text>
  </Button>
  </>
  )
};
const styles = StyleSheet.create({
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
  });
