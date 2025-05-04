import apiClient from 'app/lib/api';
import { Problem, ProblemCreate } from '../type';

export const ProblemApi = {
  getProblem: async (id: string) => {
    const response = await apiClient.get<Problem>(`/api/v1/problem/dev/${id}`);
    return response.data;
  },
  getProblems: async (id: string) => {
    const response = await apiClient.get<Problem[]>(
      `/api/v1/problem/dev/contest/${id}`
    );
    return response.data;
  },
  createProblem: async (problem: ProblemCreate) => {
    const response = await apiClient.post<Problem>('/api/v1/problem', problem);
    return response.data;
  },
  updateProblem: async (id: string, problem: ProblemCreate) => {
    const response = await apiClient.put<Problem>(
      `/api/v1/problem/${id}`,
      problem
    );
    return response.data;
  },
};
