import React from "react";
import { View, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
interface KeyViewProps {
  keyValue: string;
  countDown: number;
}

const KeyView: React.FC<KeyViewProps> = ({ keyValue, countDown }) => {
  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <Text style={styles.expiryText}>Expires in: {countDown}s</Text>
        {/* <QRCode
          value={keyValue}
          size={300} // Adjust size as needed
        /> */}
        <Text>{keyValue}</Text>
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
