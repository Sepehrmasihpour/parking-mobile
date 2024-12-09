import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function AuthForm({
  userChoice,
  userName,
  setUserName,
  rawPassword,
  setRawPassword,
  usernameError,
  passwordError,
  apiError,
  handleSignUp,
  handleSignIn,
}: {
  userChoice: "signUp" | "signIn";
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  rawPassword: string;
  setRawPassword: React.Dispatch<React.SetStateAction<string>>;
  usernameError: string;
  passwordError: string;
  apiError: string;
  handleSignUp: () => void;
  handleSignIn: () => void;
}) {
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
