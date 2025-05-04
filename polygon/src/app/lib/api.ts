// lib/api.ts
import axios from 'axios';
import JSONbig from 'json-bigint';
import axiosRetry from 'axios-retry';

// Configure JSONbig to handle Long values properly
const JSONbigString = JSONbig({ storeAsString: true });

// Create axios instance with custom JSON parser
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  transformResponse: [
    (data) => {
      try {
        return JSONbigString.parse(data);
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        return data;
      }
    },
  ],
});

// Add retry mechanism for failed requests
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

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
        return Promise.reject(
          new Error(response.data.message || 'Request failed')
        );
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

// Set auth token if it exists
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;
