import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IContact extends Document {
  eventId: Types.ObjectId;
  name: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'declined';
  attendees: number;
  messageId?: string; // WhatsApp message ID
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: 'Phone number must be a valid E.164 format',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending',
    },
    attendees: {
      type: Number,
      default: 0,
    },
    messageId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Contact ||
  mongoose.model<IContact>('Contact', ContactSchema);
