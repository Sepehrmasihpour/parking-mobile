import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "../_layout"; // Import AuthContext from the parent layout
import { Colors } from "@/constants/Colors"; // Import Colors constants

export default function ExploreScreen() {
  const { isSignedIn } = useContext(AuthContext);

  if (!isSignedIn) {
    return (
      <ThemedView style={[styles.container, styles.darkBackground]}>
        <Text style={[styles.errorText, styles.darkText]}>
          You are not signed in. 😢
        </Text>
      </ThemedView>
    );
  }

  // Render normal content if the user is signed in
  return (
    <ThemedView style={[styles.container, styles.darkBackground]}>
      <Text style={[styles.title, styles.darkText]}>Welcome to Explore</Text>
      <Text style={[styles.description, styles.darkText]}>
        Here you can explore amazing content!
      </Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  darkBackground: {
    backgroundColor: Colors.dark.background, // Use dark mode background color
  },
  darkText: {
    color: Colors.dark.text, // Use dark mode text color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
});
