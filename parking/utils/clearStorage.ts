import * as SecureStore from "expo-secure-store";

/**
 * Clears all keys stored in SecureStore for testing purposes.
 */
export const clearSecureStore = async () => {
  const keys = ["userName", "rawPassword", "accessToken", "refreshToken"];

  try {
    for (const key of keys) {
      await SecureStore.deleteItemAsync(key);
    }
    console.log("✅ SecureStore cleared successfully.");
    return true;
  } catch (error) {
    console.error("❌ Failed to clear SecureStore:", error);
    return false;
  }
};
