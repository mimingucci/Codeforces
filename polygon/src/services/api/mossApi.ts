import { apiClient } from './client';

export interface MossDetectionResponse {
  id: number;
  contestId: number;
  detectionTime: string;
  resultUrl?: string;
  language: 'C' | 'CPP' | 'JAVA' | 'PY3' | 'JS' | 'PHP' | 'GO';
  message?: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const mossApi = {
  runDetection: async (
    contestId: number,
    language: string
  ): Promise<MossDetectionResponse> => {
    const response = await apiClient.post<MossDetectionResponse>(
      `/api/v1/submission/moss/${contestId}/run?language=${language}`
    );
    return response.data;
  },

  getDetection: async (
    contestId: number,
    language: string
  ): Promise<MossDetectionResponse> => {
    const response = await apiClient.post<MossDetectionResponse>(
      `/api/v1/submission/moss/${contestId}/get?language=${language}`
    );
    return response.data;
  },

  getAllDetections: async (
    contestId: number
  ): Promise<MossDetectionResponse[]> => {
    const response = await apiClient.post<MossDetectionResponse[]>(
      `/api/v1/submission/moss/${contestId}/all`
    );
    return response.data;
  },
};
