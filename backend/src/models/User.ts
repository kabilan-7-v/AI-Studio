import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (unique creates an index automatically)
// userSchema.index({ email: 1 }); // Removed duplicate

const User = mongoose.model<IUser>('User', userSchema);

export class UserModel {
  static async create(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    return user;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  static async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async exists(email: string): Promise<boolean> {
    const count = await User.countDocuments({ email }).exec();
    return count > 0;
  }
}

export default User;
