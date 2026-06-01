import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Default host selection for development:
// - Android emulator (Android Studio): use 10.0.2.2
// - iOS simulator: use localhost
// - Physical device: replace DEV_HOST_MANUAL with your machine LAN IP (e.g. 192.168.1.42)
const DEV_HOST_MANUAL = "192.168.0.19"; // <-- your machine LAN IP (used for physical devices)
const host = DEV_HOST_MANUAL || (Platform.OS === "android" ? "10.0.2.2" : "localhost");

const BASE_URL = __DEV__
  ? `http://${host}:3333/api`
  : "https://sua-api-em-producao.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // se receber 401 globalmente, o app pode reagir (ex: logout)
    return Promise.reject(error);
  }
);

export default api;
