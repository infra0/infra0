import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { Infra0 } from '../types/infra';

// Message role type
export type MessageRole = 'user' | 'assistant';

// Interface for Message document
export interface IMessage extends Document<ObjectId> {
  conversation: ObjectId;
  role: MessageRole;
  content: string;
  infra0?: Infra0; // Optional - only populated for assistant responses that generate infrastructure
  createdAt: Date;
  updatedAt: Date;
}

// Message Schema
const MessageSchema: Schema = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  role: { 
    type: String, 
    enum: ['user', 'assistant'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  infra0: { 
    type: Object, 
    required: false // Optional - only for assistant responses with infrastructure data
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the model
export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);