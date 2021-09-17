import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";

export default function Publish({ userToken, userId, setUser }) {
  const axios = require("axios");
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [locationLat, setLocationLat] = useState("");
  const [locationLng, setLocationLng] = useState("");

  const [infoUpdate, setInfoUpdate] = useState(false);
  const [pictureUpdate, setPictureUpdate] = useState(false);

  const [pictures, setPictures] = useState([]);

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handlePicture = async () => {
    try {
      const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (response.status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
          const newArray = [...pictures];
          newArray.push(result.uri);

          setPictures(newArray);

          setPictureUpdate(true);
          console.log("PictureUpdate  ", pictureUpdate);
        } else {
          alert("No image selected");
        }
      } else {
        alert("Cancelled");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const id = await AsyncStorage.getItem("userId");
      if (infoUpdate) {
        if (title && price && description && locationLat && locationLng) {
          const response = await axios.post(
            "http://192.168.1.39:3000/room/publish",
            {
              title: title,
              price: price,
              description: description,
              location: {
                lat: locationLat,
                lng: locationLng,
              },
            },

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);

          setSubmitting(true);

          if (response.status === 200) {
            fetchDataImg(response.data._id);
            setSubmitting(false);
          }
        } else {
          setError("Please fill all field");
        }
      }
    } catch (error) {
      setError("Please fill all field");
      console.log(error.message);
    }
  };

  const fetchDataImg = async (offerId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const id = await AsyncStorage.getItem("userId");

      if (pictures.length !== 0 && pictures.length < 5 && offerId) {
        const formData = new FormData();

        const picturesArray = [...pictures];

        picturesArray.forEach((picture, index) => {
          const arrayType = picture.split(".");
          const arrayName = picture.split("/");
          return formData.append(`picture${index + 1}`, {
            uri: picture,
            name: `${arrayName[arrayName.length - 1]}`,
            type: `image/${arrayType[arrayType.length - 1]}`,
          });
        });

        const response = await axios.put(`http://192.168.1.39:3000/room/upload_picture/${offerId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmitting(true);
        if (response.status === 200) {
          setSubmitting(false);
        }

        console.log(response.data);
      } else {
        setError("Photos missing / or too much photos");
      }
    } catch (error) {
      setError("Please fill all field");
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Header image={require("../assets/logo.png")} title={"Publish"} />
        <View style={[styles.container, { width: width, height: height }]}>
          <View style={styles.itemContainer}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={(text) => {
                setTitle(text);
                setInfoUpdate(true);
              }}
              value={title}
            />
            <TextInput
              style={styles.input}
              placeholder="300 €"
              onChangeText={(text) => {
                setPrice(text);
                setInfoUpdate(true);
                keyboardType = "numeric";
              }}
              value={price}
            />
            <TextInput
              multiline
              style={styles.inputDescription}
              placeholder="Description"
              onChangeText={(text) => {
                setDescription(text);
                setInfoUpdate(true);
              }}
              value={description}
            />
            <TextInput
              style={styles.input}
              placeholder="Localisation Latitude"
              onChangeText={(text) => {
                setLocationLat(text);
                setInfoUpdate(true);
              }}
              value={locationLat}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Localisation Longitude"
              onChangeText={(text) => {
                setLocationLng(text);
                setInfoUpdate(true);
              }}
              value={locationLng}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputPhotos}>
            <TouchableOpacity onPress={handlePicture}>
              <MaterialIcons name="add-photo-alternate" size={28} color="grey" />
            </TouchableOpacity>
            <Text>Max 5 pictures</Text>
          </View>

          <View>
            <Text style={styles.txtError}>{error}</Text>

            {isSubmitting ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <TouchableOpacity
                style={styles.btnValid}
                disabled={isSubmitting}
                onPress={() => {
                  fetchData();
                }}
              >
                <Text style={styles.txtBtnValid}>Publish</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
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
  inputPhotos: {
    flexDirection: "row",
  },
});
