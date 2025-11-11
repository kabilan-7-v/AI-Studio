import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../utils/jwt';
import { signupSchema, loginSchema } from '../utils/validation';
import { LoginResponse } from '../types';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = signupSchema.parse(req.body);

    // Check if user already exists
    if (await UserModel.exists(email)) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    // Create user
    const user = await UserModel.create(email, password);

    // Generate token
    const token = generateToken({ id: user._id.toString(), email: user.email });

    const response: LoginResponse = {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValid = await UserModel.verifyPassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken({ id: user._id.toString(), email: user.email });

    const response: LoginResponse = {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
