// Service to handle authentication API calls
import axios from "axios";

const API_URL = "https://thrift-store-backend-u1vz.onrender.com/api/auth";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PhoneLoginData {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
  message?: string;
}

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post("/register", userData);
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post("/login", userData);
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  },
};
