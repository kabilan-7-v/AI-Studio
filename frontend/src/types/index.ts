export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  preferences?: UserPreferences;
  createdAt?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  defaultStyle?: StyleOption;
  notifications?: boolean;
  language?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Generation {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  originalImageUrl: string;
  status: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface GenerationRequest {
  prompt: string;
  style: string;
  image: File;
}

export type StyleOption = 'realistic' | 'artistic' | 'minimalist' | 'vintage';
