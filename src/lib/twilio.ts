/**
 * Twilio WhatsApp Integration
 * Simple, clean implementation for sending WhatsApp messages via Twilio API
 */

export async function sendWhatsAppViaTwilio(
  toPhone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Validate environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
      console.log('[Twilio] Mock mode - credentials not configured');
      console.log(`[Twilio Mock] To: ${toPhone}`);
      console.log(`[Twilio Mock] Message:\n${message}`);
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
      };
    }

    // Check if ContentSid is configured (required for WhatsApp templates)
    if (!process.env.TWILIO_CONTENT_SID) {
      console.error('[Twilio] ❌ ERROR: TWILIO_CONTENT_SID not configured!');
      console.error('[Twilio] You must create a message template in Twilio Console and add TWILIO_CONTENT_SID to .env.local');
      console.error('[Twilio] See TWILIO_SETUP.md for instructions');
      return {
        success: false,
        error: 'TWILIO_CONTENT_SID not configured',
      };
    }

    console.log('[Twilio] Sending WhatsApp message with template...');
    console.log(`[Twilio] From: ${process.env.TWILIO_WHATSAPP_NUMBER}`);
    console.log(`[Twilio] To: ${toPhone}`);
    console.log(`[Twilio] ContentSid: ${process.env.TWILIO_CONTENT_SID}`);

    // Ensure phone has whatsapp: prefix
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:') 
      ? process.env.TWILIO_WHATSAPP_NUMBER 
      : `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
    
    const formattedPhone = toPhone.startsWith('+') ? toPhone : `+${toPhone}`;
    const toNumber = `whatsapp:${formattedPhone}`;

    // Parse message to extract variables
    // Message format: "Title\n📅 Date\n🕐 Time\n📍 Location\n\nDescription\n\nRSVP Link"
    const lines = message.split('\n').filter(line => line.trim());
    const title = lines[0].replace('🎉 You\'re invited to ', '').replace('!', '');
    const date = lines[1].replace('📅 ', '');
    const time = lines[2].replace('🕐 ', '');
    const location = lines[3].replace('📍 ', '');
    const description = lines[4] || '';
    const rsvpUrl = lines[lines.length - 1];

    const contentVariables = JSON.stringify([title, date, time, location, description, rsvpUrl]);

    const bodyParams = new URLSearchParams({
      From: fromNumber,
      To: toNumber,
      ContentSid: process.env.TWILIO_CONTENT_SID,
      ContentVariables: contentVariables,
    });

    console.log('[Twilio] Request variables:', [title, date, time, location, description, rsvpUrl]);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      console.error('[Twilio] ❌ Error Response:');
      console.error('[Twilio] Status:', response.status);
      console.error('[Twilio] Message:', data.message);
      console.error('[Twilio] Code:', data.code);
      
      return {
        success: false,
        error: data.message || `Twilio error: ${response.status}`,
      };
    }

    console.log('[Twilio] ✅ Message sent successfully!');
    console.log(`[Twilio] Message SID: ${data.sid}`);

    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error: any) {
    console.error('[Twilio] ❌ Exception:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
