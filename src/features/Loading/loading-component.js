import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';


export const LoadingComponent = () => <View style={styles.container}>
    <Text style={styles.text}>Phocus</Text>
    <ActivityIndicator size="large" color="#00FF00" />
</View>;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#00FF00',
    },
});
