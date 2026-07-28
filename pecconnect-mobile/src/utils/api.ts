import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Point this to your Ngrok URL in the .env file!
// e.g. EXPO_PUBLIC_API_URL=https://1234-abcd.ngrok-free.app/api
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Crucial for Ngrok free tier!
  },
});

// Request Interceptor: Attach the Sanctum token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear secure store and trigger logout flow
      await SecureStore.deleteItemAsync('auth_token');
      // The Zustand store or a navigation listener should handle redirecting to Login
    }
    return Promise.reject(error);
  }
);
