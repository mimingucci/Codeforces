import apiClient from 'app/lib/api';
import { Contest, ContestCreate, ContestUpdate } from '../type';
import { PageableResponse } from 'types/api-types';

export const ContestApi = {
  // Get contest by ID
  getContest: async (id: string) => {
    const response = await apiClient.get<Contest>(`/api/v1/contest/${id}`);
    return response.data;
  },

  getContests: async () => {
    const response = await apiClient.get<Contest[]>('/api/v1/contest/member');
    return response.data;
  },

  getAllContests: async (
    name: string,
    page: number,
    size: number,
    start: string,
    end: string,
    type: string
  ) => {
    const response = await apiClient.get<PageableResponse<Contest>>(
      `/api/v1/contest/all?name=${name}&page=${page}&size=${size}&start=${start}&end=${end}&type=${type}`
    );
    return response.data;
  },

  // Create new contest
  createContest: async (contest: ContestCreate) => {
    const response = await apiClient.post<Contest>('/api/v1/contest', contest);
    return response.data;
  },

  // Update contest
  updateContest: async (id: string, contest: ContestUpdate) => {
    const response = await apiClient.put<Contest>(
      `/api/v1/contest/${id}`,
      contest
    );
    return response.data;
  },

  // Delete contest
  deleteContest: async (id: string) => {
    const response = await apiClient.delete<boolean>(`/api/v1/contest/${id}`);
    return response.data;
  },
};
