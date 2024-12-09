import React from "react";
import { StyleSheet, Button } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function AuthenticatedView({
  userName,
  handleClearStorage,
}: {
  userName: string;
  handleClearStorage: () => void;
}) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome, {userName || "User"}!</ThemedText>
      <Button title="Clear Storage (Sign Out)" onPress={handleClearStorage} />
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
});
