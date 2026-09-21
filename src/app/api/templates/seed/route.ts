import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Template from '@/models/Template';

const DEFAULT_TEMPLATES = [
  {
    name: 'Classic Elegant',
    type: 'wedding',
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    accentColor: '#d4af37',
    messageTemplate: 'You are cordially invited to celebrate the wedding of {guest_names}. Please join us on {event_date} at {event_time} in {location}.',
    isDefault: true,
  },
  {
    name: 'Fun & Colorful',
    type: 'birthday',
    backgroundColor: '#fff0e6',
    textColor: '#2c3e50',
    accentColor: '#ff6b9d',
    messageTemplate: '🎉 You\'re invited! {guest_names} is turning {age}! Join us on {event_date} at {event_time} in {location}.',
    isDefault: true,
  },
  {
    name: 'Modern Minimal',
    type: 'engagement',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#0066cc',
    messageTemplate: 'We\'re excited to invite you to our engagement celebration on {event_date} at {event_time} in {location}.',
    isDefault: true,
  },
  {
    name: 'Festive Gold',
    type: 'brit',
    backgroundColor: '#fffef2',
    textColor: '#4a4a4a',
    accentColor: '#ffd700',
    messageTemplate: 'We joyfully invite you to the Brit Milah of {guest_names} on {event_date} at {event_time} in {location}.',
    isDefault: true,
  },
  {
    name: 'Romantic Rose',
    type: 'anniversary',
    backgroundColor: '#fff5f7',
    textColor: '#5a3a3a',
    accentColor: '#e91e63',
    messageTemplate: 'You are invited to celebrate {years} years of marriage on {event_date} at {event_time} in {location}.',
    isDefault: true,
  },
  {
    name: 'Corporate Professional',
    type: 'corporate',
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    accentColor: '#0c63e4',
    messageTemplate: 'You are cordially invited to {event_name} on {event_date} at {event_time} in {location}. Light refreshments will be served.',
    isDefault: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if templates already exist
    const existingCount = await Template.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Templates already exist', count: existingCount },
        { status: 200 }
      );
    }

    // Create default templates
    const templates = await Template.insertMany(DEFAULT_TEMPLATES);

    return NextResponse.json(
      { message: 'Templates seeded successfully', count: templates.length },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Seed templates error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
