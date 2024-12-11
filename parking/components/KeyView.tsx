import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getDoorKey } from "../utils/api";
import { getAuthTokens } from "../utils/token";
import { blue } from "react-native-reanimated/lib/typescript/Colors";

interface KeyViewProps {
  keyValue: string;
  countDown: number;
}

const KeyView: React.FC<KeyViewProps> = ({ keyValue, countDown }) => {
  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <Text style={styles.expiryText}>Expires in: {countDown}s</Text>
        <QRCode
          value={keyValue}
          size={300} // Adjust size as needed
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1dedc",
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
