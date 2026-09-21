import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  eventType: 'wedding' | 'birthday' | 'engagement' | 'brit' | 'anniversary' | 'corporate';
  content: string; // HTML content
  design: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    layout: string;
  };
  language: 'he' | 'en' | 'ar';
  isDefault: boolean;
  createdAt: Date;
}

const TemplateSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['wedding', 'birthday', 'engagement', 'brit', 'anniversary', 'corporate'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  design: {
    colors: {
      primary: String,
      secondary: String,
      background: String,
      text: String,
    },
    fonts: {
      heading: String,
      body: String,
    },
    layout: String,
  },
  language: {
    type: String,
    enum: ['he', 'en', 'ar'],
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Template ||
  mongoose.model<ITemplate>('Template', TemplateSchema);
