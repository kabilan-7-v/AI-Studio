import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  prompt: string;
  style: string;
  image_url: string;
  original_image_url: string;
  status: string;
  created_at: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface GenerationResponse {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
  originalImageUrl: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
