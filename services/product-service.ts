import axios from "axios";
import { BACKEND_URL } from "@/config/config";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api/product`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  images: string[];
  owner: {
    username: string;
    email: string;
  };
  createdAt: Date;
}

export const productService = {
  getAllProducts: async (page: number = 1, limit: number = 8) => {
    try {
      const response = await axiosInstance.get(`?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  createProduct: async (formData: FormData) => {
    try {
      const response = await axiosInstance.post("/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  getSignedUrls: async (filenames: { name: string; type: string }[]) => {
    try {
      const response = await axiosInstance.post("/pre-signed-urls", { filenames });
      return response.data?.signedUrls;
    } catch (error) {
      console.error("Error getting signed URLs:", error);
      throw error;
    }
  },

  getRecentProducts: async (limit: number = 4) => {
    try {
      const response = await axiosInstance.get(`?sort=createdAt&order=desc&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recent products:", error);
      throw error;
    }
  },

  getTrendingProducts: async (limit: number = 4) => {
    try {
      const response = await axiosInstance.get(`?sort=views&order=desc&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending products:", error);
      throw error;
    }
  },

  getEndingProducts: async (limit: number = 4) => {
    try {
      const response = await axiosInstance.get(`?sort=endTime&order=asc&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ending products:", error);
      throw error;
    }
  }
}; 