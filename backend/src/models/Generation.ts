import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneration extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  prompt: string;
  style: string;
  imageUrl: string;
  originalImageUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const generationSchema = new Schema<IGeneration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    originalImageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
generationSchema.index({ userId: 1, createdAt: -1 });
generationSchema.index({ createdAt: -1 });

const Generation = mongoose.model<IGeneration>('Generation', generationSchema);

export class GenerationModel {
  static async create(
    userId: string,
    prompt: string,
    style: string,
    imageUrl: string,
    originalImageUrl: string
  ): Promise<IGeneration> {
    const generation = new Generation({
      userId,
      prompt,
      style,
      imageUrl,
      originalImageUrl,
      status: 'completed',
    });

    await generation.save();
    return generation;
  }

  static async findById(id: string): Promise<IGeneration | null> {
    return Generation.findById(id).exec();
  }

  static async findByUserId(userId: string, limit = 5): Promise<IGeneration[]> {
    return Generation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  static async countByUserId(userId: string): Promise<number> {
    return Generation.countDocuments({ userId }).exec();
  }
}

export default Generation;
