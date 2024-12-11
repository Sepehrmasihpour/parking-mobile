import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, createContext } from "react";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";
import { View, Text } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

// Create AuthContext to share isSignedIn and setIsSignedIn
export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: (val: boolean) => {},
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInternet, setHasInternet] = useState(true);
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const checkInternet = async () => {
      const state = await Network.getNetworkStateAsync();
      // If not connected or not internet reachable, set hasInternet to false
      if (!state.isConnected || !state.isInternetReachable) {
        setHasInternet(false);
      }
    };
    checkInternet();
  }, []);

  useEffect(() => {
    const checkSignInStatus = async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      setIsSignedIn(!!accessToken);
      setIsLoading(false);
    };

    if (hasInternet) {
      checkSignInStatus();
    }
  }, [hasInternet]);

  useEffect(() => {
    if (fontsLoaded && !isLoading && hasInternet) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading, hasInternet]);

  // If fonts are loading or the sign-in check isn't finished, show nothing
  if (!fontsLoaded || isLoading) {
    return null;
  }

  // If there is no internet, show an error message with a sad emoji
  if (!hasInternet) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>No internet connection 🙁</Text>
      </View>
    );
  }

  // Otherwise, proceed to show the app
  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
