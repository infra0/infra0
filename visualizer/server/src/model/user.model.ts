import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { hashPassword } from '../helpers/jwt';

// Interface for User document
export interface IUser extends Document <ObjectId> {
  firstName: string;
  lastName: string;
  password: string;
  avatar?: string;
  email?: string;
  provider?: string;
  isEmailVerified?: boolean;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String },
  email: { type: String, unique: true, sparse: true },
  provider: { type: String, default: 'email' },
  isEmailVerified: { type: Boolean, default: false },
}, { timestamps: true }
);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password as string);
  next();
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);