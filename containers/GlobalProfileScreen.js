import React from "react";
import axios from "axios";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SmallHeader from "../components/SmallHeader";

export default function GlobalProfileScreen({ userToken, userId, setUser }) {
  const [username, setUsername] = useState("");
  const [picture, setPicture] = useState("");
  const [rooms, setRooms] = useState("");

  useEffect(() => {
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

          setUsername(response.data.account.username);
          if (response.data.account.photo.url) {
            setPicture(response.data.account.photo.url);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchDataRoom = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const id = await AsyncStorage.getItem("userId");

        if (token && id) {
          const response = await axios.get(`http://192.168.1.39:3000/user/rooms/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("fetchDataRoom >>>>", response.data);

          setRooms(response.data);
          if (response.data.account.photo.url) {
            setPicture(response.data.account.photo.url);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <View>
      <SafeAreaView>
        <ScrollView>
          <SmallHeader image={require("../assets/logo.png")} />
          <View style={styles.container}>
            <TouchableOpacity style={styles.profilContainer}>
              <View>
                {picture ? (
                  <Image source={{ uri: picture }} style={styles.imageContainer} />
                ) : (
                  <Image source={require("../assets/avatar-user.png")} style={styles.imageContainer} />
                )}
              </View>
              <View>
                <Text style={styles.txtUsername}>{username}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.roomContainer}>
              <View>
                {/* {picture ? (
                  <Image source={{ uri: picture }} style={styles.imageContainer} />
                ) : (
                  <Image source={require("../assets/avatar-user.png")} style={styles.imageContainer} />
                )} */}
              </View>
              <View>
                <Text style={styles.txtUsername}>{rooms[0]}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  profilContainer: {
    flex: 1,
    borderColor: "#cecece",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    margin: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#efeded",
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderColor: "#cecece",
    borderWidth: 1,
    borderRadius: 100,
    marginRight: 20,
  },
  txtUsername: {
    color: "#cecece",
    fontSize: 24,
    fontWeight: "bold",
  },
});
