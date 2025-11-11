import apiClient from './client';
import { AuthResponse, LoginCredentials, SignupCredentials } from '../types';

export const authApi = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};
