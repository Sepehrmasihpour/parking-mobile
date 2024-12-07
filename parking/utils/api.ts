import axios from "axios";

// Base URL from the environment variables
const API_URL = process.env.API_URL || "http://localhost:8000/api";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies or cross-origin credentials
});

// Helper function to add authorization headers dynamically
const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// -------- API Endpoints --------

// User Registration
export const registerUser = async (userName: string, rawPassword: string) => {
  const response = await apiClient.post("/register", {
    user_name: userName,
    raw_password: rawPassword,
  });
  return response.data;
};

// User Login
export const loginWithPassword = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await apiClient.post("/login/password", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

// Refresh Token
export const refreshAuthToken = async (refreshToken: string) => {
  const response = await apiClient.post("/refresh", {
    refresh_token: refreshToken,
  });
  return response.data;
};

// Logout
export const logoutUser = async (accessToken: string) => {
  setAuthToken(accessToken);
  const response = await apiClient.post("/logout");
  return response.data;
};

// Fetch User Data
export const fetchUserData = async (accessToken: string) => {
  setAuthToken(accessToken);
  const response = await apiClient.get("/data");
  return response.data;
};

// Generate Door Key
export const getDoorKey = async (accessToken: string) => {
  setAuthToken(accessToken);
  const response = await apiClient.get("/key");
  return response.data;
};

// Create Add Balance Token
export const createAddBalanceToken = async (
  amount: number,
  accessToken: string
) => {
  setAuthToken(accessToken);
  const response = await apiClient.get(`/addBalance/create?amount=${amount}`);
  return response.data;
};

// Add Balance
export const addBalance = async (token: string, isAdmin: boolean = false) => {
  const response = await apiClient.post(
    "/addBalance",
    { token },
    {
      headers: isAdmin ? { "Admin-Token": "admin-secret-key" } : {},
    }
  );
  return response.data;
};

// Create Ticket
export const createTicket = async () => {
  const response = await apiClient.get("/ticket", { responseType: "text" }); // Assuming HTML is returned
  return response.data;
};

// Open Parking Door
export const openParkingDoor = async (
  door: "entry" | "exit",
  token: string,
  paymentSuccessful: boolean = false
) => {
  const response = await apiClient.post(`/open/${door}`, {
    token: { token },
    payment_successfull: paymentSuccessful,
  });
  return response.data;
};
