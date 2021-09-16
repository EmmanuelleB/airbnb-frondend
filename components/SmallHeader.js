import React from "react";

import { Button, Text, View, Image, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default function Header(props) {
  const { image, title } = props;
  return (
    <View style={styles.containerHeader}>
      <Image source={image} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "transparent",
    borderBottomColor: "#cecece",
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
});
