import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import User from '@/models/User';
import Contact from '@/models/Contact';
import { z } from 'zod';

// Event creation schema
const createEventSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  eventDate: z.string().datetime(),
  eventTime: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
  templateId: z.string().optional().nullable(),
});

// GET /api/events - Fetch all events for logged-in user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const events = await Event.find({ userId })
      .select('_id title type eventDate eventTime location description templateId createdAt updatedAt')
      .lean()
      .exec();

    return NextResponse.json({ events }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const data = createEventSchema.parse(body);

    // Build event object
    const eventData: any = {
      userId,
      title: data.title,
      type: data.type,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      location: data.location,
      description: data.description,
    };

    // Only add templateId if provided and not empty
    if (data.templateId && data.templateId.trim() !== '') {
      eventData.templateId = data.templateId;
    }

    const event = new Event(eventData);
    await event.save();

    return NextResponse.json(
      { event: event.toObject() },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('Create event validation error:', error.errors);
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create event error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
