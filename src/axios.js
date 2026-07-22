import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const IMAGE_BASE_URL = "http://192.168.1.20:5000";

const getBaseURL = () => {
  return `${IMAGE_BASE_URL}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
