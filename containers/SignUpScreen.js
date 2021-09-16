import React from "react";
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import Header from "../components/Header";

export default function SignUpScreen({ setUser }) {
  const axios = require("axios");
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [secure, setSecure] = useState(true);

  const fetchData = async () => {
    try {
      if (email && name && username && description && password && confirmPassword) {
        if (password === confirmPassword) {
          // "https://express-airbnb-api.herokuapp.com/user/sign_up"
          const response = await axios.post("http://192.168.1.39:3000/user/sign_up", {
            email: email,
            name: name,
            username: username,
            description: description,
            password: password,
          });
          setSubmitting(true);
          console.log(response.data);

          if (response.data.token) {
            setUser(response.data.token, response.data._id);
          }
        }
      } else {
        setError("Please fill all field");
      }
      setSubmitting(false);
    } catch (error) {
      setError("error");
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        <ScrollView>
          <StatusBar barStyle="default" hidden={false} backgroundColor="white" translucent={true} />
          <View style={[styles.container, { width: width, height: height }]}>
            <Header image={require("../assets/logo.png")} title={"Sign up"} />
            <View style={styles.itemContainer}>
              <View>
                <TextInput
                  placeholder="email"
                  style={styles.input}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                  value={email}
                />
                <TextInput
                  placeholder="username"
                  style={styles.input}
                  onChangeText={(text) => {
                    setUsername(text);
                  }}
                  value={username}
                />
                <TextInput
                  placeholder="name"
                  style={styles.input}
                  onChangeText={(text) => {
                    setName(text);
                  }}
                  value={name}
                />
                <TextInput
                  placeholder="Description yourself in a few word ..."
                  style={styles.input}
                  onChangeText={(text) => {
                    setDescription(text);
                  }}
                  value={description}
                />

                <View style={styles.inputIcone}>
                  <TextInput
                    placeholder="password"
                    style={styles.input}
                    onChangeText={(text) => {
                      setPassword(text);
                    }}
                    value={password}
                    secureTextEntry={secure}
                  />
                  {secure ? (
                    <FontAwesome name="eye" onPress={() => setSecure(!secure)} style={styles.icone} />
                  ) : (
                    <FontAwesome name="eye-slash" onPress={() => setSecure(!secure)} style={styles.icone} />
                  )}
                </View>
                <View style={styles.inputIcone}>
                  <TextInput
                    placeholder="confirm password"
                    style={styles.input}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                    }}
                    value={confirmPassword}
                    secureTextEntry={secure}
                  />
                  {secure ? (
                    <FontAwesome name="eye" onPress={() => setSecure(!secure)} style={styles.icone} />
                  ) : (
                    <FontAwesome name="eye-slash" onPress={() => setSecure(!secure)} style={styles.icone} />
                  )}
                </View>
              </View>

              <View>
                <Text style={styles.txtError}>{error}</Text>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <TouchableOpacity
                    style={styles.btnValid}
                    onPress={() => {
                      fetchData();
                      // const userToken = "secret-token";
                      // setToken(userToken);
                    }}
                  >
                    <Text style={styles.txtBtnValid}>Sign up</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignIn");
                  }}
                >
                  <Text style={styles.btnRedirection}>Already have an account ? Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  itemContainer: {
    width: "90%",
  },
  input: {
    height: 45,
    width: "100%",
    borderColor: "#EB5A62",
    borderBottomWidth: 1,
  },

  inputIcone: {
    flexDirection: "row",
    position: "relative",
  },
  icone: {
    color: "gray",
    fontSize: 20,
    position: "absolute",
    right: 0,
    bottom: 15,
  },
  txtError: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    color: "#EB5A62",
  },

  btnValid: {
    height: 45,
    borderWidth: 1.5,
    borderColor: "#EB5A62",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  txtBtnValid: {
    fontWeight: "bold",
  },
  btnRedirection: {
    color: "grey",
    textAlign: "center",
  },
});
