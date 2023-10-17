import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { AuthenticationContext } from "../../../services/authentication.context";
import { AccountInfoNavigator } from "../../../infrastructure/navigation/account-info.navigator";
import { SubscriptionScreen } from "../../subscription/subscription-screen";

export const AccountScreen = ({ navigation }) => {
    const { handleLogout } = useContext(AuthenticationContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => handleLogout()} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SubscriptionScreen")} style={styles.button}>
                <Text style={styles.buttonText}>Subscription</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    button: {
        backgroundColor: "limegreen",
        width: "80%",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "black",
        fontWeight: "700",
        fontSize: 16,
    },
});
