import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { sendWhatsAppMessage } from '@/lib/whatsapp-client';
import { z } from 'zod';

const sendSchema = z.object({
  eventId: z.string(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  isTest: z.boolean().optional(),
});

// Generate invitation message from event
function generateInvitationMessage(event: any, invitationUrl: string): string {
  const eventDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `🎉 You're invited to ${event.title}!

📅 ${eventDate}
🕐 ${event.eventTime}
📍 ${event.location}

${event.description ? `📝 ${event.description}\n` : ''}
Please click the link below to confirm your attendance:
${invitationUrl}`;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const data = sendSchema.parse(body);

    // Get event to build invitation link
    const event = await Event.findById(data.eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Generate invitation URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const invitationUrl = `${appUrl}/rsvp/${data.eventId}`;

    // Generate message
    const message = generateInvitationMessage(event, invitationUrl);

    // Send WhatsApp message
    const result = await sendWhatsAppMessage(data.phone, message);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: result.success,
        messageId: result.messageId,
        phone: data.phone,
        invitationUrl: invitationUrl,
        isTest: data.isTest || false,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
