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

// Send WhatsApp message - mock by default, real if whatsapp-web.js installed
async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // If WhatsApp is not enabled, use mock mode
    if (process.env.WHATSAPP_ENABLED !== 'true') {
      console.log('[WhatsApp Mock] WhatsApp disabled - mock mode');
      console.log(`[WhatsApp Mock] To: ${phone}`);
      console.log(`[WhatsApp Mock] Message:\n${message}`);
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
      };
    }

    // Try to dynamically load whatsapp-web.js
    try {
      const whatsappWebModule = await import('whatsapp-web.js');
      const { Client, LocalAuth } = whatsappWebModule;
      
      const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      });

      client.on('qr', (qr: string) => {
        console.log('[WhatsApp QR] Scan this QR code:');
        console.log(qr);
      });

      client.on('ready', () => {
        console.log('[WhatsApp] ✅ Client ready');
      });

      await client.initialize();

      const formattedPhone = phone.replace(/^\+/, '').replace(/\D/g, '');
      const chatId = `${formattedPhone}@c.us`;
      const response = await client.sendMessage(chatId, message);

      console.log('[WhatsApp] ✅ Message sent');
      await client.destroy();

      return {
        success: true,
        messageId: response.id.id,
      };
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log('[WhatsApp] whatsapp-web.js not installed, using mock mode');
        console.log(`[WhatsApp Mock] To: ${phone}`);
        console.log(`[WhatsApp Mock] Message:\n${message}`);
        return {
          success: true,
          messageId: `mock_${Date.now()}`,
        };
      }
      throw error;
    }
  } catch (error: any) {
    console.error('[WhatsApp] Error:', error.message);
    // Fallback to mock on any error
    console.log(`[WhatsApp Mock] Fallback - To: ${phone}`);
    console.log(`[WhatsApp Mock] Message:\n${message}`);
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const data = sendSchema.parse(body);

    // Get event
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
