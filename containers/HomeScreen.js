import {
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

import Card from "../components/Card";
import SmallHeader from "../components/SmallHeader";

export default function HomeScreen({ navigation }) {
  const axios = require("axios");
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://express-airbnb-api.herokuapp.com/rooms");
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      {isLoading ? (
        <View style={{ width: width, height: height, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : (
        <SafeAreaView>
          <SmallHeader image={require("../assets/logo.png")} />

          <View style={styles.container}>
            <FlatList
              contentContainerStyle={{ paddingBottom: 120 }}
              data={data}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      return navigation.navigate("Room", { id: item._id });
                    }}
                  >
                    <Card
                      title={item.title}
                      description={item.description}
                      price={`${item.price} €`}
                      ratingValue={item.ratingValue}
                      avatar={{
                        uri: item.user.account.photo.url,
                      }}
                      image={{
                        uri: item.photos[0].url,
                      }}
                      reviews={`${item.reviews} reviews`}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => String(item._id)}
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
