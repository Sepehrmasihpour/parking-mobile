import React, { useState, useCallback, useContext } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { registerUser, loginWithPassword } from "../../utils/api";
import { AuthContext } from "../_layout";
import ChoiceView from "@/components/ChoiceView";
import AuthForm from "@/components/AuthForm";
import KeyView from "@/components/KeyView";
import { getAuthTokens } from "../../utils/token";

const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,35}$/;

export default function LoginSignUpScreen() {
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [userChoice, setUserChoice] = useState<null | "signUp" | "signIn">(
    null
  );
  const [userName, setUserName] = useState("");
  const [rawPassword, setRawPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  // New state for key management
  const [key, setKey] = useState<string | null>(null);

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
      // On success:
      setIsSignedIn(true);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setApiError("This username has been taken. Please choose another.");
      } else {
        setApiError("An error occurred while signing up. Please try again.");
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
      // On success:
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

  const handleClearStorage = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setIsSignedIn(false);
  };

  if (isSignedIn) {
    // Replace AuthenticatedView with KeyView and pass key, setKey, and getDoorKey function
    return (
      <KeyView
        keyValue={key} // Renamed prop to keyValue to avoid conflicts with JSX "key" prop
        setKey={setKey}
      />
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
