import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";

interface AddBalanceConfigProps {
  onConfirm: (amount: number) => void;
}

const AddBalanceConfig: React.FC<AddBalanceConfigProps> = ({ onConfirm }) => {
  const [amount, setAmount] = useState<number>(10000);

  const handleIncrement = () => {
    setAmount((prev) => prev + 10000);
  };

  const handleDecrement = () => {
    setAmount((prev) => Math.max(10000, prev - 10000));
  };

  const handleChange = (val: string) => {
    // Ensure integer and above 10000
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 10000) {
      setAmount(parsed);
    } else if (val === "") {
      // Allow clearing field but do not confirm invalid input
      setAmount(0);
    }
  };

  const handleConfirm = () => {
    if (amount >= 10000 && Number.isInteger(amount)) {
      onConfirm(amount);
    } else {
      // You could show an error message if needed
      console.error("Amount must be an integer and >= 10000");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Amount (≥ 10000):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount === 0 ? "" : amount.toString()}
        onChangeText={handleChange}
      />
      <View style={styles.buttonRow}>
        <Button title="+" onPress={handleIncrement} />
        <Button title="-" onPress={handleDecrement} />
      </View>
      <View style={styles.confirmContainer}>
        <Button title="Confirm" onPress={handleConfirm} color="#007AFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    width: 200,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
    marginBottom: 20,
  },
  confirmContainer: {
    marginTop: 20,
  },
});

export default AddBalanceConfig;
