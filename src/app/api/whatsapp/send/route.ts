import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import Event from '@/models/Event';
import { z } from 'zod';

const sendSchema = z.object({
  eventId: z.string(),
  contactId: z.string(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  message: z.string().min(1),
  invitationUrl: z.string().url(),
});

// For production, use Twilio or another WhatsApp API provider
// This is a placeholder for the send logic
async function sendWhatsAppMessage(
  phone: string,
  message: string,
  invitationUrl: string
): Promise<{ messageId: string; success: boolean }> {
  try {
    // TODO: Implement actual WhatsApp API call using Twilio or similar
    // For now, return mock response
    console.log(`Sending WhatsApp to ${phone}: ${message}`);
    console.log(`Invitation URL: ${invitationUrl}`);

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

    // Send WhatsApp message
    const result = await sendWhatsAppMessage(
      data.phone,
      data.message,
      data.invitationUrl
    );

    if (result.success) {
      // Update contact with message ID
      await Contact.findByIdAndUpdate(
        data.contactId,
        { messageId: result.messageId }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
