import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import HomeScreen from "./containers/HomeScreen";
import GlobalProfileScreen from "./containers/GlobalProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import AroundMe from "./containers/AroundMe";
import RoomScreen from "./containers/RoomScreen";
import Publish from "./containers/Publish";
import UserProfile from "./containers/UserProfile";
import RoomProfile from "./containers/RoomProfile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const setUser = async (token, id) => {
    if (token && id) {
      AsyncStorage.setItem("userToken", token);
      AsyncStorage.setItem("userId", id);
    } else {
      AsyncStorage.removeItem("userToken");
      AsyncStorage.removeItem("userId");
    }

    setUserToken(token);
    setUserId(id);
    // console.log("userId ===== >   ", userId);
    // console.log("userToken ===== >   ", userToken);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken === null ? ( // We haven't finished checking for the token yet
        // No token found, user isn't signed in
        <Stack.Navigator>
          <Stack.Screen name="SignIn" options={{ headerShown: false }}>
            {(props) => <SignInScreen {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" options={{ headerShown: false }}>
            {(props) => <SignUpScreen {...props} setUser={setUser} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // User is signed in
        <Stack.Navigator>
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "#EB5A62",
                  inactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => <Ionicons name={"ios-home"} size={size} color={color} />,
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />

                      <Stack.Screen name="Room" options={{ headerShown: false }} component={RoomScreen} />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="Around"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => <Entypo name={"location-pin"} size={size} color={color} />,
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen name="Around" options={{ headerShown: false }}>
                        {(props) => <AroundMe {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="Publish"
                  options={{
                    tabBarLabel: "Publish",
                    tabBarIcon: ({ color, size }) => <Ionicons name="add" size={size} color={color} />,
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen name="Publish" options={{ headerShown: false }}>
                        {(props) => <Publish {...props} setUser={setUser} userToken={userToken} userId={userId} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => <AntDesign name={"user"} size={size} color={color} />,
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen name="Profile" options={{ headerShown: false }}>
                        {(props) => (
                          <GlobalProfileScreen {...props} setUser={setUser} userToken={userToken} userId={userId} />
                        )}
                      </Stack.Screen>

                      <Stack.Screen name="UserProfile" options={{ headerShown: false }}>
                        {(props) => <UserProfile {...props} setUser={setUser} />}
                      </Stack.Screen>

                      <Stack.Screen name="RoomProfile" options={{ headerShown: false }}>
                        {(props) => <RoomProfile {...props} setUser={setUser} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
