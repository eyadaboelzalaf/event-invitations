import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { z } from 'zod';

const contactSchema = z.object({
  eventId: z.string(),
  name: z.string().min(1),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

const bulkContactSchema = z.object({
  eventId: z.string(),
  contacts: z.array(contactSchema),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const eventId = request.nextUrl.searchParams.get('eventId');
    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      );
    }

    const contacts = await Contact.find({ eventId }).sort({ createdAt: -1 });

    return NextResponse.json(contacts, { status: 200 });
  } catch (error: any) {
    console.error('Fetch contacts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Check if bulk upload
    if (Array.isArray(body)) {
      const contacts = z.array(contactSchema).parse(body);
      const result = await Contact.insertMany(contacts);
      return NextResponse.json(result, { status: 201 });
    } else {
      // Single contact
      const data = contactSchema.parse(body);
      const contact = new Contact(data);
      await contact.save();
      return NextResponse.json(contact, { status: 201 });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
