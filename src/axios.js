import axios from "axios";
import { Platform } from "react-native";

const getBaseURL = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    if (typeof window !== "undefined") {
        return `http://${window.location.hostname}:5000/api`;
    }

    if (Platform.OS === "android") {
        return "http://10.0.2.2:5000/api";
    }

    return "http://localhost:5000/api";
};

const api = axios.create({
    baseURL: getBaseURL(),
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;