import apiClient from 'app/lib/api';
import { User } from '../type';
import { PageableResponse } from 'types/api-types';

export const UserApi = {
  getUser: async (id: string) => {
    const response = await apiClient.get<User>(`/api/v1/user/${id}`);
    return response.data;
  },
  search: async (query: string) => {
    const response = await apiClient.get<PageableResponse<User>>(
      `/api/v1/user/search`,
      {
        params: { query },
      }
    );
    return response.data;
  },
  getUsers: async (ids: string[]) => {
    const response = await apiClient.post<User[]>(`/api/v1/user/batch`, ids);
    return response.data;
  },
  changeAdmin: async (id: string) => {
    const response = await apiClient.put<boolean>(`/api/v1/user/role/${id}`);
    return response.data;
  },
  banUser: async (id: string) => {
    const response = await apiClient.put<boolean>(`/api/v1/user/ban/${id}`);
    return response.data;
  },
  getAll: async (
    username: string,
    email: string,
    page: number,
    size: number
  ) => {
    const response = await apiClient.get<PageableResponse<User>>(
      `/api/v1/user/all`,
      {
        params: { username, email, page, size },
      }
    );
    return response.data;
  },
};
