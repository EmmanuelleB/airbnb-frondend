import React from "react";

import { Button, Text, View, Image, StyleSheet } from "react-native";

export default function Header(props) {
  const { image, title } = props;
  return (
    <View style={styles.containerHeader}>
      <Image source={image} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    marginTop: 60,
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    color: "grey",
    fontSize: 30,
  },
});
