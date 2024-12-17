import React, { useState, useCallback, useContext, useEffect } from "react";
import { BackHandler, ActivityIndicator, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { registerUser, loginWithPassword } from "../../utils/api";
import { AuthContext } from "../_layout";
import ChoiceView from "@/components/ChoiceView";
import AuthForm from "@/components/AuthForm";
import KeyView from "@/components/KeyView";
import KeyButton from "@/components/KeyButton";

const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,35}$/;

export default function HomeScreen() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [userChoice, setUserChoice] = useState<null | "signUp" | "signIn">(
    null
  );
  const [userName, setUserName] = useState("");
  const [rawPassword, setRawPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [key, setKey] = useState<string | null>(null);
  const [keyTimer, setKeyTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (userChoice !== null) {
          setUserChoice(null);
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [userChoice])
  );

  useEffect(() => {
    if (!key) return;

    setKeyTimer(60);
    const interval = setInterval(() => {
      setKeyTimer((prev) => {
        if (prev <= 1) {
          setKey(null); // Reset key after countdown
          clearInterval(interval);
          return 60; // Reset timer if needed
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [key]);

  useEffect(() => {
    if (!key) return;
    setIsLoading(false);
  }, [key]);

  const handleSignUp = async () => {
    setUsernameError("");
    setPasswordError("");
    setApiError("");

    if (!USERNAME_REGEX.test(userName)) {
      setUsernameError(
        "Username can only contain letters, numbers, or underscores."
      );
      return;
    }

    if (!PASSWORD_REGEX.test(rawPassword)) {
      setPasswordError(
        "Password must be 6-35 characters long and include both letters and numbers."
      );
      return;
    }

    try {
      const response = await registerUser(userName, rawPassword);
      await SecureStore.setItemAsync("userName", userName);
      await SecureStore.setItemAsync("rawPassword", rawPassword);
      setIsSignedIn(true);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setApiError("This username has been taken. Please choose another.");
      } else {
        setApiError(
          "An error occurred while signing up. Please try again." + error
        );
      }
    }
  };

  const handleSignIn = async () => {
    setUsernameError("");
    setPasswordError("");
    setApiError("");

    try {
      const response = await loginWithPassword(userName, rawPassword);
      await SecureStore.setItemAsync("userName", userName);
      await SecureStore.setItemAsync("rawPassword", rawPassword);
      await SecureStore.setItemAsync("accessToken", response.access_token);
      await SecureStore.setItemAsync("refreshToken", response.refresh_token);
      setIsSignedIn(true);
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setUsernameError("No user found with this username.");
      } else if (error?.response?.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setApiError("An error occurred while signing in. Please try again.");
      }
    }
  };

  if (isSignedIn) {
    if (isLoading) {
      return (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return key === null ? (
      <KeyButton setKey={setKey} setLoadingStatus={setIsLoading} />
    ) : (
      <KeyView keyValue={key} countDown={keyTimer} />
    );
  }

  if (userChoice === null) {
    return <ChoiceView setUserChoice={setUserChoice} />;
  }

  return (
    <AuthForm
      userChoice={userChoice}
      userName={userName}
      setUserName={setUserName}
      rawPassword={rawPassword}
      setRawPassword={setRawPassword}
      usernameError={usernameError}
      passwordError={passwordError}
      apiError={apiError}
      handleSignUp={handleSignUp}
      handleSignIn={handleSignIn}
    />
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
