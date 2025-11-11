import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const generationSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(500, 'Prompt must be less than 500 characters'),
  style: z.enum(['realistic', 'artistic', 'minimalist', 'vintage'], {
    errorMap: () => ({ message: 'Invalid style selected' }),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GenerationInput = z.infer<typeof generationSchema>;
