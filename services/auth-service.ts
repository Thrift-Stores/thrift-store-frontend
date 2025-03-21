// Service to handle authentication API calls
import axios from "axios"

const API_URL = "http://localhost:8080/api/auth"

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface PhoneLoginData {
  phone: string
  otp: string
}

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    name: string
    email: string
  }
  token?: string
  message?: string
}

export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData)
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("token", response.data.token)
      }
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData)
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("token", response.data.token)
      }
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    if (userStr) return JSON.parse(userStr)
    return null
  },

  getToken: () => {
    return localStorage.getItem("token")
  },
}

