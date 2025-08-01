import mongoose, { Schema, Document, ObjectId } from 'mongoose';


// Interface for User document
export interface IConversation extends Document <ObjectId> {
  title: String,
  user: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  total_messages_count?: number, // Virtual field from Mongoose populate
}


// User Schema
const ConversationSchema: Schema = new Schema({
 title: { type: String, required: true, default: 'New Conversation' },
 user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});


ConversationSchema.virtual('messageList', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation',
    justOne: false
});
  

ConversationSchema.virtual('total_messages_count', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'conversation',
    count: true
});

// Create and export the model
export const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema); 