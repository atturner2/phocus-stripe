import React from "react";
import { StatusBar, StyleSheet, SafeAreaView, Text, View } from "react-native";

import { MeditateComponent } from "../components/meditate.component";

export const MeditateScreen = ({ navigation }) => {
  return (
    <MeditateComponent/>
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