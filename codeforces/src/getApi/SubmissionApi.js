import axios from "axios";
import { API_BASE_URL } from "../config";
import JSONbig from "json-bigint";

const BASE_URL = "http://localhost:8088/api/v1/submission-evaluation-handler";

// Create a custom axios instance with JSONbig
const axiosInstance = axios.create({
  transformResponse: [(data) => JSONbig.parse(data)],
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
          contest: data.contest,
          problem: data.problem.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
          transformRequest: [(data) => JSONbig.stringify(data)],
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting code:", error);
      throw error;
    }
  },

  submitVirtual: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/v1/submission/virtual`,
        {
          language: data.language,
          sourceCode: data.sourceCode,
          contest: data.contest,
          problem: data.problem.toString(),
          virtualContest: data.virtualContest, 
        },
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            "Content-Type": "application/json",
          },
          transformRequest: [(data) => JSONbig.stringify(data)],
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting code:", error);
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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting submission details:", error);
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
          transformResponse: (data) => JSONbig.parse(data),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting submission details:", error);
      throw error;
    }
  },
  execute: async ({ accessToken, language, sourceCode, input }) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/execute`,
        {
          language,
          sourceCode,
          input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error executing code:", error);
      throw error;
    }
  },
  getByAuthorAndDateRange: (authorId, startDate, endDate) => {
    return axios.get(`${API_BASE_URL}/api/v1/submission/author/${authorId}`, {
      params: {
        startDate,
        endDate
      }
    });
  },
  getByAuthorAndVerdict: (authorId, verdict) => {
    return axios.get(`${API_BASE_URL}/api/v1/submissions/author/${authorId}/verdict/${verdict}`);
  },
};

export default SubmissionApi;
