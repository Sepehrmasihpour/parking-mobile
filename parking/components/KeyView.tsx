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
    let interval: NodeJS.Timeout | null = null;
    if (keyValue) {
      setCountDown(60); // reset countdown each time a new key is obtained
      interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            // Once we hit zero, reset key
            setKey(null);
            if (interval) clearInterval(interval);
            return 60; // reset timer value if needed
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [keyValue, setKey]);

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
          <IconSymbol name="key" size={60} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.expiryText}>Expires in: {countDown}s</Text>
          <QRCode
            value={keyValue}
            size={250} // Adjust size as needed
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
