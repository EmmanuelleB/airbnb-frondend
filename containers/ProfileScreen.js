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

export default function ProfileScreen({ userToken, userId, setUser }) {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [pictureModified, setPictureModified] = useState(false);
  const [infoModified, setInfoModified] = useState(false);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const id = await AsyncStorage.getItem("userId");

      if (token && id) {
        const response = await axios.get(`http://192.168.1.39:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setEmail({ value: response.data.email, isModified: false });
        setUsername({ value: response.data.account.username, isModified: false });
        setName(response.data.account.name);
        setDescription(response.data.account.description);
        if (response.data.account.photo.url) {
          setPicture(response.data.account.photo.url);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGetPicture = async () => {
    try {
      const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (response.status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.cancelled) {
          setPicture(result.uri);
          setPictureModified(true);
          console.log("pictureModified  > ", pictureModified);
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

  const handleTakePicture = async () => {
    try {
      const response = await ImagePicker.requestCameraPermissionsAsync();
      if (response.status === "granted") {
        const result = await ImagePicker.launchCameraAsync();

        if (!result.cancelled) {
          setPicture(result.uri);
          setPictureModified(true);
          console.log("pictureModified  > ", pictureModified);
        } else {
          alert("No photo taken");
        }
      } else {
        alert("Unauthorized");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const id = await AsyncStorage.getItem("userId");
    console.log("coucou");
    console.log("pictureModified  > ", pictureModified);

    try {
      if (pictureModified) {
        const arrayType = picture.split(".");
        const arrayName = picture.split("/");

        const formData = new FormData();
        formData.append("picture", {
          uri: picture,
          name: `${arrayName[arrayName.length - 1]}`,
          type: `image/${arrayType[arrayType.length - 1]}`,
        });

        const response = await axios.put(`http://192.168.1.39:3000/user/upload-picture/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        // setPicture(response.data.account.photo.url);

        // if (Array.isArray(formData) === true && formData > 0) {
        //   setPicture(response.data.account.photo.url);
        //   console.log("picture ==> ", picture);
        // }
      }
      if (infoModified) {
        let params = {
          name: name,
          description: description,
        };
        if (email.isModified) {
          params.email = email.value;
        }
        if (username.isModified) {
          params.username = username.value;
        }

        const response = await axios.put("http://192.168.1.39:3000/user/update", params, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLoading(true);
        console.log(response.data);

        if (response.status === 200) {
          setIsLoading(false);
          fetchData();
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <ScrollView>
          <SmallHeader image={require("../assets/logo.png")} />
          <View style={styles.container}>
            <View style={styles.photoContainer}>
              <View>
                {picture ? (
                  <Image source={{ uri: picture }} style={styles.imageContainer} />
                ) : (
                  <Image source={require("../assets/avatar-user.png")} style={styles.imageContainer} />
                )}
              </View>
              <View>
                <TouchableOpacity style={styles.icone} onPress={handleGetPicture}>
                  <MaterialIcons name="add-photo-alternate" size={28} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icone} onPress={handleTakePicture}>
                  <MaterialIcons name="add-a-photo" size={28} color="grey" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.itemContainer}>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(text) => {
                  setEmail({ value: text, isModified: true });
                  setInfoModified(true);
                }}
                value={email.value}
              />
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setUsername({ value: text, isModified: true });
                  setInfoModified(true);
                }}
                value={username.value}
              />
              <TextInput
                style={styles.input}
                onChangeText={(text) => {
                  setName(text);
                  setInfoModified(true);
                }}
                value={name}
              />
              <TextInput
                multiline
                style={styles.inputDescription}
                onChangeText={(text) => {
                  setDescription(text);
                  setInfoModified(true);
                }}
                value={description}
              />
            </View>
            {isLoading ? (
              <View style={{ width: width, height: height, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color="grey" />
              </View>
            ) : (
              <TouchableOpacity onPress={handleUpdate} style={styles.btnValid}>
                <Text style={styles.txtBtnValid}>Update</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setUser(null, null);
              }}
              style={styles.btnValid}
            >
              <Text style={styles.txtBtnValid}>Log out</Text>
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
