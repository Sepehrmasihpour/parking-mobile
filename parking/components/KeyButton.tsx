import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getAuthTokens } from "../utils/token";
import { getDoorKey } from "../utils/api";

interface KeyButtonProps {
  setKey: (value: string | null) => void;
  setLoadingStatus: (value: boolean) => void;
}

const KeyButton: React.FC<KeyButtonProps> = ({ setKey, setLoadingStatus }) => {
  const handleGetKey = async () => {
    setLoadingStatus(true);
    try {
      const { accessToken } = await getAuthTokens();
      const response = await getDoorKey(accessToken);
      if (response && response.token) {
        setKey(response.token);
      }
    } catch (error) {
      console.error("Failed to get key:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.keyButton} onPress={handleGetKey}>
        <IconSymbol name="key" size={70} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default KeyButton;
