import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  View,
} from "react-native";
import { getAuthTokens } from "@/utils/token";
import { fetchUserData, createAddBalanceToken } from "@/utils/api";
import { ThemedView } from "@/components/ThemedView";
import { AuthContext } from "../_layout";
import { Colors } from "@/constants/Colors";
import AddBalanceConfig from "@/components/AddBalanceConfig";
import KeyView from "@/components/KeyView"; // The provided KeyView component

export default function BalanceScreen() {
  const { isSignedIn } = useContext(AuthContext);

  // States
  const [balance, setBalance] = useState<number | null>(null);
  const [charge, setCharge] = useState<boolean>(false);
  const [addToken, setAddToken] = useState<string | null>(null);
  const [countDown, setCountDown] = useState<number>(60);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      if (isSignedIn && !charge) {
        const { accessToken } = await getAuthTokens();
        const data = await fetchUserData(accessToken);
        // Assuming data.balance is returned by fetchUserData
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [isSignedIn, charge]);

  useEffect(() => {
    // Fetch user data when component mounts if charge is false
    fetchData();
  }, [fetchData]);

  // Refresh logic (pull-to-refresh)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  // useEffect when charge changes to true, fetch user data again
  useEffect(() => {
    const refetchIfCharged = async () => {
      if (charge && isSignedIn) {
        try {
          const { accessToken } = await getAuthTokens();
          const data = await fetchUserData(accessToken);
          setBalance(data.balance);
        } catch (error) {
          console.error("Error fetching user data on charge:", error);
        }
      }
    };
    refetchIfCharged();
  }, [charge, isSignedIn]);

  // useEffect for addToken countdown logic
  useEffect(() => {
    if (!addToken) return;

    setCountDown(60);
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          setAddToken(null); // Reset addToken after countdown
          clearInterval(interval);
          return 60; // Reset timer if needed
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [addToken]);

  const handleAddBalance = async (amount: number) => {
    // Function to handle creating AddBalanceToken
    // amount > 10000 guaranteed by AddBalanceConfig logic
    try {
      const { accessToken } = await getAuthTokens();
      const res = await createAddBalanceToken(amount, accessToken);
      // Assuming response schema: { token: string }
      if (res?.token) {
        setAddToken(res.token);
      }
    } catch (error) {
      console.error("Failed to create add balance token:", error);
    }
  };

  // Format balance with commas and a large "T"
  const formatBalance = (bal: number | null): string => {
    if (bal === null) return "";
    return bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "T";
  };

  if (!isSignedIn) {
    return (
      <ThemedView style={[styles.container, styles.darkBackground]}>
        <Text style={[styles.errorText, styles.darkText]}>
          You are not signed in. 😢
        </Text>
      </ThemedView>
    );
  }

  // If we have an addToken and it's not null, show KeyView with countdown
  if (addToken !== null) {
    return <KeyView keyValue={addToken} countDown={countDown} />;
  }

  // If charge is true, show AddBalanceConfig
  if (charge) {
    return (
      <ScrollView
        style={[styles.darkBackground, { flex: 1 }]}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AddBalanceConfig onConfirm={handleAddBalance} />
      </ScrollView>
    );
  }

  // If charge is false, show balance and Add button
  return (
    <ScrollView
      style={[styles.darkBackground, { flex: 1 }]}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {balance !== null && (
        <Text style={[styles.balanceText, styles.darkText]}>
          {formatBalance(balance)}
        </Text>
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Add" onPress={() => setCharge(true)} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  darkBackground: {
    backgroundColor: Colors.dark.background,
  },
  darkText: {
    color: Colors.dark.text,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
});
