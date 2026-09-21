import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { z } from 'zod';

const sendSchema = z.object({
  eventId: z.string(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  isTest: z.boolean().optional(),
});

// Generate invitation message from event
function generateInvitationMessage(event: any): string {
  const eventDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `🎉 You're invited!\n\n${event.title}\n\n📅 ${eventDate} at ${event.eventTime}\n📍 ${event.location}\n\nPlease click the link below to confirm your attendance:\n{invitation_link}`;
}

// For production, use Twilio or another WhatsApp API provider
// This is a placeholder for the send logic
async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<{ messageId: string; success: boolean }> {
  try {
    // TODO: Implement actual WhatsApp API call using Twilio or similar
    // For now, return mock response
    console.log(`[WHATSAPP TEST] Sending to ${phone}`);
    console.log(`[WHATSAPP TEST] Message: ${message}`);

    return {
      messageId: `msg_${Date.now()}`,
      success: true,
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      messageId: '',
      success: false,
    };
  }
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
    const messageTemplate = generateInvitationMessage(event);
    const message = messageTemplate.replace('{invitation_link}', invitationUrl);

    // Send WhatsApp message
    const result = await sendWhatsAppMessage(data.phone, message);

    return NextResponse.json(
      {
        success: result.success,
        messageId: result.messageId,
        phone: data.phone,
        message: message,
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
