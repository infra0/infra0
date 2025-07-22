import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { hashPassword } from '../helpers/jwt';

// Interface for User document
export interface IUser extends Document <ObjectId> {
  firstName: string;
  lastName: string;
  contact: string;
  password: string;
  avatar?: string;
}


// User Schema
const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contact: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password as string);
  next();
});

// Create and export the model
export const UserModel = mongoose.model<IUser>('User', UserSchema);