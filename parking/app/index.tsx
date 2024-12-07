import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { registerUser, loginWithPassword } from "../utils/api"; // Adjust the path accordingly
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Regex for validation
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,35}$/;

export default function LoginSignUpScreen() {
  const [userChoice, setUserChoice] = useState<"none" | "signUp" | "signIn">(
    "none"
  );
  const [userName, setUserName] = useState("");
  const [rawPassword, setRawPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  const handleSignUp = async () => {
    setUsernameError("");
    setPasswordError("");
    setApiError("");

    if (!USERNAME_REGEX.test(userName)) {
      setUsernameError(
        "Username can only contain letters, numbers, or underscores."
      );
      return;
    }

    if (!PASSWORD_REGEX.test(rawPassword)) {
      setPasswordError(
        "Password must be 6-35 characters long and include both letters and numbers."
      );
      return;
    }

    try {
      const response = await registerUser(userName, rawPassword);
      await SecureStore.setItemAsync("userName", userName);
      await SecureStore.setItemAsync("rawPassword", rawPassword);
      await SecureStore.setItemAsync("accessToken", response.token);
      await SecureStore.setItemAsync("refreshToken", response.refresh_token);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setApiError("This username has been taken. Please choose another.");
      } else {
        setApiError("An error occurred while signing up. Please try again.");
      }
    }
  };

  const handleSignIn = async () => {
    setUsernameError("");
    setPasswordError("");
    setApiError("");

    try {
      const response = await loginWithPassword(userName, rawPassword);
      await SecureStore.setItemAsync("userName", userName);
      await SecureStore.setItemAsync("rawPassword", rawPassword);
      await SecureStore.setItemAsync("accessToken", response.token);
      await SecureStore.setItemAsync("refreshToken", response.refresh_token);
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setUsernameError("No user found with this username.");
      } else if (error?.response?.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setApiError("An error occurred while signing in. Please try again.");
      }
    }
  };

  if (userChoice === "none") {
    return (
      <ThemedView style={styles.centeredContainer}>
        <Button title="Sign Up" onPress={() => setUserChoice("signUp")} />
        <Button title="Sign In" onPress={() => setUserChoice("signIn")} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        {userChoice === "signUp" ? "Sign Up" : "Sign In"}
      </ThemedText>
      <View style={styles.formGroup}>
        <Text>Username:</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter a username"
          autoCapitalize="none"
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}
      </View>
      <View style={styles.formGroup}>
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          value={rawPassword}
          onChangeText={setRawPassword}
          placeholder="Enter a password"
          secureTextEntry
          autoCapitalize="none"
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>
      <Button
        title="Confirm"
        onPress={userChoice === "signUp" ? handleSignUp : handleSignIn}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    color: "white",
    backgroundColor: "#333",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
