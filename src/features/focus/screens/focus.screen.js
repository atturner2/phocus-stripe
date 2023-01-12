import React from "react";
import { StatusBar, StyleSheet, SafeAreaView, Text, View } from "react-native";

import { FocusComponent } from "../components/focus.component";

export const FocusScreen = ({ navigation }) => {
  return (
    <FocusComponent/>
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