import * as SecureStore from "expo-secure-store";
import { loginWithPassword, refreshAuthToken, logoutUser } from "./api";

// Retrieve stored user credentials
export const getUserCredentials = async () => {
  const userName = await SecureStore.getItemAsync("userName");
  const rawPassword = await SecureStore.getItemAsync("rawPassword");
  return { userName, rawPassword };
};

// Update tokens in secure storage
export const updateTokens = async (
  newAccessToken: string,
  newRefreshToken: string
) => {
  await SecureStore.setItemAsync("accessToken", newAccessToken);
  await SecureStore.setItemAsync("refreshToken", newRefreshToken);
};

// Refresh tokens function
export const refreshTokens = async () => {
  try {
    // Get the refresh token directly from SecureStore
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // First attempt to refresh tokens using the primary endpoint
    try {
      const response = await refreshAuthToken(refreshToken);
      const { access_token, refresh_token } = response;

      // Update tokens in secure storage
      await updateTokens(access_token, refresh_token);
      return { accessToken: access_token, refreshToken: refresh_token };
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.warn(
          "Primary token refresh failed, attempting login with credentials."
        );

        // Retrieve stored user credentials
        if (accessToken) {
          await logoutUser(accessToken);
        }
        const { userName, rawPassword } = await getUserCredentials();
        if (!userName || !rawPassword) {
          throw new Error("No user credentials available for login.");
        }

        // Use the loginWithPassword endpoint to get new tokens
        const response = await loginWithPassword(userName, rawPassword);
        const { access_token, refresh_token } = response;

        // Update tokens in secure storage

        await updateTokens(access_token, refresh_token);
        return { accessToken: access_token, refreshToken: refresh_token };
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Failed to refresh tokens:", error.message);
    throw new Error("Could not refresh tokens.");
  }
};

// Retrieve stored tokens (with auto-refresh)
export const getAuthTokens = async () => {
  try {
    // Refresh tokens before returning
    const { accessToken, refreshToken } = await refreshTokens();
    return { accessToken, refreshToken };
  } catch (error: any) {
    console.error("Failed to get updated tokens:", error.message);
    throw new Error("Could not retrieve updated tokens.");
  }
};
