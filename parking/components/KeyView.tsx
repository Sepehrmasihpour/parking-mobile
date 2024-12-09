import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getDoorKey } from "../utils/api";
import { getAuthTokens } from "../utils/token";

interface KeyViewProps {
  keyValue: string | null;
  setKey: (value: string | null) => void;
}

const KeyView: React.FC<KeyViewProps> = ({ keyValue, setKey }) => {
  const [countDown, setCountDown] = useState<number>(60);

  useEffect(() => {
    if (!keyValue) return; // Do nothing if keyValue is null

    setCountDown(60); // Reset countdown only when a valid key is obtained
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          setKey(null); // Reset key after countdown
          clearInterval(interval);
          return 60; // Reset timer if needed
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [keyValue]);
  const handleGetKey = async () => {
    try {
      const { accessToken } = await getAuthTokens();
      const response = await getDoorKey(accessToken);
      // Assuming response is { token: string }
      if (response && response.token) {
        setKey(response.token);
      }
    } catch (error) {
      console.error("Failed to get key:", error);
      // Optionally handle error, display message, etc.
    }
  };

  return (
    <View style={styles.container}>
      {keyValue === null ? (
        <TouchableOpacity style={styles.keyButton} onPress={handleGetKey}>
          <IconSymbol name="key" size={70} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.expiryText}>Expires in: {countDown}s</Text>
          <QRCode
            value={keyValue}
            size={300} // Adjust size as needed
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  expiryText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default KeyView;
