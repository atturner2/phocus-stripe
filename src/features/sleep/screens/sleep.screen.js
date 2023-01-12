import React from "react";
import { StatusBar, StyleSheet, SafeAreaView, Text, View } from "react-native";

import { SleepComponent } from "../components/sleep.component";

export const SleepScreen = ({ navigation }) => {
  return (
    <SleepComponent/>
  );
};
  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  search: {
    padding: 16,
  },
  list: {
    flex: 1,
    padding: 16,
    backgroundColor: "blue",
  },
});