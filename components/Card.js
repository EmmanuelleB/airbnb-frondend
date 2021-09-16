import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { Button, Text, View, Image, StyleSheet } from "react-native";

export default function Card(props) {
  const { title, price, ratingValue, image, avatar, reviews } = props;
  const ratingStar = (num) => {
    let rating = [];
    for (let i = 0; i < 5; i++) {
      if (num > i) {
        rating.push(<FontAwesome name="star" size={18} color="#E6B91F" key={i} />);
      }
      if (num <= i) {
        rating.push(<FontAwesome name="star" size={18} color="#cecece" key={i} />);
      }
    }
    return rating;
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.photo} />
        <Text style={styles.price}>{price}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.col1}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>{ratingStar(ratingValue)}</Text>
            <Text style={styles.review}>{reviews}</Text>
          </View>
        </View>
        <Image source={avatar} style={styles.avatar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   borderColor: "blue",
  //   borderWidth: 2,
  // },
  imageContainer: {
    position: "relative",
  },
  photo: {
    width: "100%",
    height: 200,
  },
  price: {
    position: "absolute",
    bottom: 15,
    color: "white",
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "transparent",
    borderBottomColor: "#cecece",
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: 10,
  },
  col1: {
    width: "72%",
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 21,
    marginVertical: 5,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },

  star: { marginRight: 10 },
  review: { color: "grey" },
});
