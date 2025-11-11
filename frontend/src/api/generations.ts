import apiClient from './client';
import { Generation, GenerationRequest } from '../types';

export const generationsApi = {
  create: async (
    data: GenerationRequest,
    signal?: AbortSignal
  ): Promise<Generation> => {
    const formData = new FormData();
    formData.append('prompt', data.prompt);
    formData.append('style', data.style);
    formData.append('image', data.image);

    const response = await apiClient.post<Generation>('/generations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal,
    });

    return response.data;
  },

  list: async (limit = 5): Promise<Generation[]> => {
    const response = await apiClient.get<Generation[]>(`/generations?limit=${limit}`);
    return response.data;
  },
};
