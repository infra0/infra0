import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { Tokens } from '../types/auth.types';

export enum SessionStatus {
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',    
}

export interface ISession extends Document <ObjectId> {
  sessionId: string;
  tokens: Tokens;
  status: SessionStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema({
  sessionId: { type: String, required: true },
  tokens: { type: Object },
  status: { type: String, enum: SessionStatus, default: SessionStatus.IN_PROGRESS },
  expiresAt: { type: Date, required: true },
}, { timestamps: true }
);


export const SessionModel = mongoose.model<ISession>('Session', SessionSchema);