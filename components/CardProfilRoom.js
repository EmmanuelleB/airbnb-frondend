import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { Button, Text, View, Image, StyleSheet } from "react-native";

export default function CardProfilRoom(props) {
  const { title, price, image, ratingValue, reviews } = props;
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
    <View style={styles.roomContainer}>
      <View>
        <Image source={image} style={styles.photo} />
      </View>
      <View style={styles.infosContainer}>
        <View style={styles.lineContainer}>
          <Text style={styles.star}>{ratingStar(ratingValue)}</Text>
          <Text style={styles.review}>{reviews}</Text>
        </View>
        <Text numberOfLines={2}>{title}</Text>
        <View style={styles.lineContainer}>
          <Text style={styles.price}>{price}</Text>
          <Text> /nuit</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roomContainer: {
    marginHorizontal: 30,
    marginVertical: 10,
    backgroundColor: "#edeaea",
    borderRadius: 5,
    flexDirection: "row",
  },
  photo: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    // marginRight: 10,
  },
  infosContainer: {
    width: "60%",
    padding: 10,
    justifyContent: "space-around",
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
  },
  star: { marginRight: 10 },
  review: { color: "grey" },
});
