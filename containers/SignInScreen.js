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
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";

import Header from "../components/Header";

export default function SignInScreen({ setUser }) {
  const axios = require("axios");
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [secure, setSecure] = useState(true);

  const fetchData = async () => {
    try {
      if (email && password) {
        // "https://express-airbnb-api.herokuapp.com/user/log_in"
        const response = await axios.post("http://192.168.1.39:3000/user/log_in", {
          email: email,
          password: password,
        });
        setSubmitting(true);
        console.log(response.data);

        if (response.data.token) {
          setUser(response.data.token, response.data._id);
        }
      } else {
        setError("Please fill all field");
      }
      setSubmitting(false);
    } catch (error) {
      setError("Password or email doesn't work");
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <ScrollView>
          <StatusBar barStyle="default" hidden={false} backgroundColor="white" translucent={true} />
          <View style={[styles.container, { width: width, height: height }]}>
            <Header image={require("../assets/logo.png")} title={"Sign in"} />
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

                      // const userToken = "secret-token";
                      // setToken(userToken);
                    }}
                  >
                    <Text style={styles.txtBtnValid}>Sign in</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                >
                  <Text style={styles.btnRedirection}>No account ? Register</Text>
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
    bottom: 12,
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
