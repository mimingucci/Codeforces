import axios from 'axios';
import { API_BASE_URL } from '../config';
import JSONbig from 'json-bigint';

// Create a custom axios instance with JSONbig
const axiosInstance = axios.create({
  transformResponse: [data => JSONbig.parse(data)]
});

const SubmissionApi = {
  /**
   * Submit code for evaluation
   * @param {Object} data - Submission data
   * @returns {Promise<Object>} - Submission result with ID
   */
  submit: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/v1/submission`,
        {
          language: data.language,
          sourceCode: data.sourceCode,
          problem: data.problem.toString()
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          },
          transformRequest: [(data) => JSONbig.stringify(data)]
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  },

  /**
   * Get details of a submission
   * @param {string} id - Submission ID
   * @param {string} accessToken - JWT access token
   * @returns {Promise<Object>} - Submission details
   */
  getDetails: async (id, accessToken) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/submission/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting submission details:', error);
      throw error;
    }
  },
  /**
   * Get all submissions for a user
   * @param {string} accessToken - JWT access token
   * @param {number} page - Page number for pagination
   * @returns {Promise<Object>} - List of submissions
   */
  getAllSubmissions: async (id, page = 0, size = 50) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/api/v1/submission/user/${id}?page=${page}&size=${size}`,
        {
          transformResponse: (data) => JSONbig.parse(data)
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting submission details:', error);
      throw error;
    }
  }
};

export default SubmissionApi;
