import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  View,
  BackHandler,
  ActivityIndicator,
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
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSignedIn && !charge) {
        const { accessToken } = await getAuthTokens();
        const data = await fetchUserData(accessToken);
        // Assuming data.balance is returned by fetchUserData
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false); // Hide spinner once data is fetched
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

  // useEffect for addToken countdown logic
  useEffect(() => {
    if (!addToken) return;

    setCountDown(60);
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          setAddToken(null); // Reset addToken after countdown
          setCharge(false);
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
    setIsLoading(true);
    try {
      const { accessToken } = await getAuthTokens();
      const res = await createAddBalanceToken(amount, accessToken);
      // Assuming response schema: { token: string }
      if (res?.token) {
        setAddToken(res.token);
      }
    } catch (error) {
      console.error("Failed to create add balance token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Back handler to revert charge if addToken is null
  useEffect(() => {
    const onBackPress = () => {
      // If charge is true and addToken is null, revert charge to false
      if (charge && addToken === null) {
        setCharge(false);
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    };

    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => {
      backHandlerListener.remove();
    };
  }, [charge, addToken]);

  // Format balance with commas and a large "T"
  const formatBalance = (bal: number | null): string => {
    if (bal === null) return "";
    return bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "T";
  };

  if (!isSignedIn) {
    return (
      <ThemedView style={[styles.erroContainer]}>
        <Text style={[styles.errorText, styles.darkText]}>
          You are not signed in. 😢
        </Text>
      </ThemedView>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If we have an addToken and it's not null, show KeyView with countdown
  if (addToken !== null) {
    return <KeyView keyValue={addToken} countDown={countDown} />;
  }

  // If charge is true and addToken is null, show AddBalanceConfig
  if (charge && addToken === null) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
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
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {balance !== null && (
        <Text style={[styles.balanceText, styles.darkText]}>
          {formatBalance(balance)}
        </Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setCharge(true)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  erroContainer: {
    justifyContent: "center",
    alignContent: "center",
    padding: 16,
    paddingTop: 40,
  },
  darkText: {
    color: Colors.dark.text,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
    alignSelf: "center",
    width: "100%", // Make the ScrollView wider
    maxHeight: "100%", // Center and size in the middle
    borderRadius: 16,
    backgroundColor: Colors.dark.background,
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: "30%",
  },
  addButton: {
    marginTop: 0,
    width: "80%", // Make the button wider
    paddingVertical: 16,
    backgroundColor: "#007AFF",
    borderRadius: 24, // Add rounded edges
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
