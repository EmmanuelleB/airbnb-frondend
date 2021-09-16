import {
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import SmallHeader from "../components/SmallHeader";
import * as Location from "expo-location";
import axios from "axios";

export default function AroundMe({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [coords, setCoords] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const response = await Location.requestForegroundPermissionsAsync();
        console.log(response);

        if (response.status === "granted") {
          const location = await Location.getCurrentPositionAsync();

          setCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          // alert("Permission refusée");
          setError(true);
          const response = await axios.get("https://express-airbnb-api.herokuapp.com/rooms/around");
          setData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getPermission();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/around?longitude=${coords.longitude}&latitude=${coords.latitude}`
        );

        setIsLoading(false);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [coords]);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" color="grey" />
      ) : (
        <SafeAreaView>
          <SmallHeader image={require("../assets/logo.png")} />
          <View>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              showsUserLocation
              initialRegion={
                error
                  ? {
                      longitude: 2.3446088174688873,
                      latitude: 48.85493069600655,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }
                  : {
                      longitude: coords.longitude,
                      latitude: coords.latitude,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    }
              }
            >
              {data.map((marker, index) => {
                return (
                  <MapView.Marker
                    // onPress={() => navigation.navigate("Room", { id: marker._id })}
                    key={marker._id}
                    coordinate={{
                      longitude: marker.location[0],
                      latitude: marker.location[1],
                    }}
                  >
                    <MapView.Callout
                      style={{
                        width: 250,
                        height: 100,
                        backgroundColor: "white",
                        borderRadius: 10,
                        flexDirection: "row",
                      }}
                      tooltip
                      onPress={() => navigation.navigate("Room", { id: marker._id })}
                    >
                      <Image
                        source={{
                          uri: marker.photos[0].url,
                        }}
                        style={styles.photo}
                      />
                      <View style={styles.infosContainer}>
                        <View style={styles.lineContainer}>
                          <FontAwesome name="star" size={12} color="#E6B91F" />
                          <Text> {marker.ratingValue}</Text>
                          <Text style={styles.reviews}>{` (${marker.reviews})`}</Text>
                        </View>
                        <Text numberOfLines={2}>{marker.title}</Text>

                        <View style={styles.lineContainer}>
                          <Text style={styles.price}>{`${marker.price}€ `}</Text>
                          <Text> /nuit</Text>
                        </View>
                      </View>
                    </MapView.Callout>
                  </MapView.Marker>
                );
              })}
            </MapView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  photo: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    // marginRight: 10,
  },
  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
  },
  infosContainer: {
    width: "60%",
    padding: 10,
    justifyContent: "space-around",
  },
  reviews: {
    color: "grey",
  },
});
