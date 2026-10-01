import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  description?: string;
  templateId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: false,
      sparse: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
