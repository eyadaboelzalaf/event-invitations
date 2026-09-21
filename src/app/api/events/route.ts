import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['wedding', 'birthday', 'engagement', 'brit', 'anniversary', 'corporate']),
  eventDate: z.string().datetime(),
  eventTime: z.string(),
  location: z.string().min(1),
  description: z.string().optional(),
  templateId: z.string().optional().refine((val) => !val || val.length > 0, 'Invalid template ID'),
  customizations: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const events = await Event.find({ userId })
      .populate('templateId')
      .populate('contacts')
      .sort({ createdAt: -1 });

    return NextResponse.json(events, { status: 200 });
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = eventSchema.parse(body);

    const event = new Event({
      userId,
      ...data,
      status: 'draft',
    });

    await event.save();
    await event.populate('templateId');

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
