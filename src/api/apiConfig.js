
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://www.movnn.com";
const API_KEY = "42ed8aa7-fc8d-4cae-b31b-01c4e6219f3e";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 300000, 
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Request to:", config.url);
      console.log("Request data:", config.data);

  
      config.headers.Authorization = `Bearer ${API_KEY}`;

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
      console.error("No response received. Check network or server status.");
    } else {
      console.error("Error message:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
