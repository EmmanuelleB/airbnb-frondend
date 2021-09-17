import React from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

import {
  Dimensions,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react/cjs/react.development";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SmallHeader from "../components/SmallHeader";
import { MaterialIcons } from "@expo/vector-icons";

export default function RoomProfile({ navigation, setUser, route }) {
  const id = route.params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [locationLat, setLocationLat] = useState([]);
  const [locationLng, setLocationLng] = useState([]);

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token && id) {
        const response = await axios.get(`http://192.168.1.39:3000/rooms/${id}`);
        console.log(response.data);
        setTitle(response.data.title);
        setPrice(String(response.data.price));
        setDescription(response.data.description);
        setLocationLat(String(response.data.location[0]));
        setLocationLng(String(response.data.location[1]));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <ScrollView>
          <SmallHeader image={require("../assets/logo.png")} />
          <View style={styles.container}>
            <Text>{id}</Text>

            <View style={styles.itemContainer}>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setTitle(text);
                }}
                value={title}
              />
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setPrice(text);
                }}
                value={price}
                keyboardType="numeric"
              />

              <TextInput
                multiline
                style={styles.inputDescription}
                onChangeText={(text) => {
                  setDescription(text);
                }}
                value={description}
              />
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setLocationLat(text);
                }}
                value={locationLat}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setLocationLng(text);
                }}
                value={locationLng}
                keyboardType="numeric"
              />
            </View>
            {isLoading ? (
              <View style={{ width: width, height: height, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="grey" />
              </View>
            ) : (
              <TouchableOpacity style={styles.btnValid}>
                <Text style={styles.txtBtnValid}>Update</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btnValid}>
              <Text style={styles.txtBtnValid}>Delete Room</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 20,
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderColor: "#EB5A62",
    borderWidth: 1,
    borderRadius: 200,
    marginRight: 20,
  },

  icone: {
    marginVertical: 10,
  },
  itemContainer: {
    marginBottom: 20,
  },
  input: {
    height: 45,
    width: "100%",
    borderColor: "#EB5A62",
    borderBottomWidth: 1,
  },
  inputDescription: {
    marginTop: 20,
    height: 100,
    width: "100%",
    borderColor: "#EB5A62",
    borderWidth: 1,
  },
  btnValid: {
    height: 45,
    borderWidth: 1.5,
    borderColor: "#EB5A62",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  txtBtnValid: {
    fontWeight: "bold",
  },
});
