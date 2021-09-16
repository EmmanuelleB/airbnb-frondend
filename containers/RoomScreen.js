import React, { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import { SwiperFlatList } from "react-native-swiper-flatlist";

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SmallHeader from "../components/SmallHeader";

export default function RoomScreen({ route }) {
  const axios = require("axios");
  const id = route.params.id;
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");
  const [description, setDescription] = useState(3);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://express-airbnb-api.herokuapp.com/rooms/${id}`);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [id]);

  return (
    <View>
      {isLoading ? (
        <View style={{ width: width, height: height, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : (
        <SafeAreaView>
          <ScrollView>
            <SmallHeader image={require("../assets/logo.png")} />
            <View style={styles.container}>
              <View style={styles.imagesContainer}>
                <SwiperFlatList
                  autoplay
                  autoplayDelay={4}
                  autoplayLoop
                  index={0}
                  showPagination
                  data={data.photos}
                  renderItem={({ item }) => (
                    <View style={styles.itemImage}>
                      <Image source={{ uri: item.url }} style={styles.photo} />
                    </View>
                  )}
                />

                <Text style={styles.price}>{`${data.price} €`}</Text>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.col1}>
                  <Text numberOfLines={1} style={styles.title}>
                    {data.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.star}>{ratingStar(data.ratingValue)}</Text>
                    <Text style={styles.review}>{`${data.reviews} reviews`}</Text>
                  </View>
                </View>
                <Image source={{ uri: data.user.account.photo.url }} style={styles.avatar} />
              </View>
              <TouchableOpacity
                onPress={() => {
                  <Text numberOfLines={setDescription(null)}>{data.description}</Text>;
                }}
              >
                <View>
                  <Text numberOfLines={description} style={styles.description}>
                    {data.description}
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    longitude: data.location[0],
                    latitude: data.location[1],
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                >
                  <MapView.Marker
                    coordinate={{
                      longitude: data.location[0],
                      latitude: data.location[1],
                    }}
                  />
                </MapView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  imagesContainer: {
    position: "relative",
    flex: 1,
  },
  itemImage: {
    width,
    justifyContent: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 15,
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
  photo: {
    width: "100%",
    height: 300,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 75,
  },
  price: {
    position: "absolute",
    bottom: 15,
    color: "white",
    backgroundColor: "black",
    padding: 10,
    paddingRight: 20,
    paddingLeft: 20,
    fontSize: 24,
  },
  star: { marginRight: 10 },
  review: { color: "grey" },
  description: {
    marginBottom: 15,
  },
  map: {
    width: "100%",
    height: 300,
  },
});
