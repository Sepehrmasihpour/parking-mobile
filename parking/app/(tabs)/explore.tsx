import React, { useContext } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "../_layout"; // Import AuthContext from the parent layout

export default function ExploreScreen() {
  const { isSignedIn } = useContext(AuthContext);

  if (!isSignedIn) {
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.errorText}>You are not signed in. 😢</Text>
      </ThemedView>
    );
  }

  // Render normal content if the user is signed in
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Welcome to Explore</Text>
      <Text style={styles.description}>
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
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
});
