import { Response, NextFunction } from 'express';
import { AuthRequest, GenerationResponse } from '../types';
import { GenerationModel } from '../models/Generation';
import { generationSchema } from '../utils/validation';

// Simulate generation delay (1-2 seconds)
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const createGeneration = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const { prompt, style } = generationSchema.parse(req.body);

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ message: 'Image file is required' });
      return;
    }

    // Simulate generation delay (1-2 seconds)
    const delayMs = 1000 + Math.random() * 1000;
    await delay(delayMs);

    // 20% chance of "Model overloaded" error
    if (Math.random() < 0.2) {
      res.status(503).json({ message: 'Model overloaded' });
      return;
    }

    // Create generation record
    const userId = req.user!.id;
    const imageUrl = `/uploads/${req.file.filename}`;
    const originalImageUrl = `/uploads/${req.file.filename}`;

    const generation = await GenerationModel.create(
      userId,
      prompt,
      style,
      imageUrl,
      originalImageUrl
    );

    // Format response
    const response: GenerationResponse = {
      id: generation._id.toString(),
      prompt: generation.prompt,
      style: generation.style,
      imageUrl: generation.imageUrl,
      originalImageUrl: generation.originalImageUrl,
      status: generation.status,
      createdAt: generation.createdAt.toISOString(),
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getGenerations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 5;

    const generations = await GenerationModel.findByUserId(userId, limit);

    // Format response
    const response: GenerationResponse[] = generations.map((gen) => ({
      id: gen._id.toString(),
      prompt: gen.prompt,
      style: gen.style,
      imageUrl: gen.imageUrl,
      originalImageUrl: gen.originalImageUrl,
      status: gen.status,
      createdAt: gen.createdAt.toISOString(),
    }));

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
