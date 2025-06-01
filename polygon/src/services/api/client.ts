import axios from 'axios';
import JSONbig from 'json-bigint';
import axiosRetry from 'axios-retry';
import { getSession } from 'next-auth/react';

// Configure JSONbig to handle Long values properly
const JSONbigString = JSONbig({ storeAsString: true });

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: (data) => {
    try {
      return JSONbigString.parse(data);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return data;
    }
  },
});

// Add retry mechanism for failed requests
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get current session
      const session = await getSession();

      // Add token if available
      if (session?.user?.token && config.headers) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      }

      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle BaseResponse wrapper
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the BaseResponse
    if (
      response.data &&
      response.data.code &&
      response.data.data !== undefined
    ) {
      if (response.data.code !== '200') {
        throw new Error(response.data.message || 'Request failed');
      }
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response?.data) {
      const errorData = error.response.data;
      if (errorData.code && errorData.message) {
        return Promise.reject(new Error(errorData.message));
      }
    }
    return Promise.reject(error);
  }
);
