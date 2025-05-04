import apiClient from 'app/lib/api';
import { User } from '../type';

export const UserApi = {
  getUser: async (id: string) => {
    const response = await apiClient.get<User>(`/api/v1/user/${id}`);
    return response.data;
  },
};
