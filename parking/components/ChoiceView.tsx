import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export default function ChoiceView({
  setUserChoice,
}: {
  setUserChoice: React.Dispatch<
    React.SetStateAction<null | "signUp" | "signIn">
  >;
}) {
  return (
    <ThemedView style={styles.centeredContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setUserChoice("signUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setUserChoice("signIn")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  button: {
    backgroundColor: "#007BFF", // Customize button color
    paddingVertical: 16, // Makes the button larger
    paddingHorizontal: 32, // Makes the button larger
    borderRadius: 25, // Round edges
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // Spacing between buttons
    width: 200, // Fixed width for consistency
  },
  buttonText: {
    color: "#FFF", // Button text color
    fontSize: 18, // Larger text
    fontWeight: "bold", // Bold text
  },
});
