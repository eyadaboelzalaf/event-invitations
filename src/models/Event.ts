import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEvent extends Document {
  userId: Types.ObjectId;
  title: string;
  type: 'wedding' | 'birthday' | 'engagement' | 'brit' | 'anniversary' | 'corporate';
  eventDate: Date;
  eventTime: string;
  location: string;
  description: string;
  templateId?: Types.ObjectId;
  customizations: Record<string, any>;
  contacts: Types.ObjectId[];
  sendDate?: Date;
  sendTime?: string;
  status: 'draft' | 'preview' | 'scheduled' | 'sent';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
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
      enum: ['wedding', 'birthday', 'engagement', 'brit', 'anniversary', 'corporate'],
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
    },
    customizations: {
      type: Schema.Types.Mixed,
      default: {},
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
      },
    ],
    sendDate: {
      type: Date,
    },
    sendTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'preview', 'scheduled', 'sent'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
