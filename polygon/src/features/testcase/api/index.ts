import apiClient from 'app/lib/api';
import { Testcase, TestcaseCreate, TestcaseCreateBatch } from '../type';

export const TestcaseApi = {
  getTestcases: async (id: string) => {
    const response = await apiClient.get<Testcase[]>(
      `/api/v1/testcase/problem/${id}`
    );
    return response.data;
  },
  getTestcase: async (id: string) => {
    const response = await apiClient.get<Testcase>(`/api/v1/testcase/${id}`);
    return response.data;
  },
  createTestcase: async (testcase: TestcaseCreate) => {
    const response = await apiClient.post<Testcase>(
      '/api/v1/testcase',
      testcase
    );
    return response.data;
  },
  createBatchTestcase: async (testcases: TestcaseCreateBatch) => {
    const response = await apiClient.post<Testcase[]>(
      '/api/v1/testcase/batch',
      testcases
    );
    return response.data;
  },
  updateTestcase: async (id: string, testcase: TestcaseCreate) => {
    const response = await apiClient.put<Testcase>(
      `/api/v1/testcase/${id}`,
      testcase
    );
    return response.data;
  },
  deleteTestcase: async (id: string) => {
    const response = await apiClient.delete<boolean>(`/api/v1/testcase/${id}`);
    return response.data;
  },
  deleteTestcases: async (problemId: string) => {
    const response = await apiClient.delete<boolean>(
      `/api/v1/testcase/problem/${problemId}`
    );
    return response.data;
  },
};
