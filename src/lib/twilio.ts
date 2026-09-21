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

    // Twilio API endpoint
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

    // Format phone number for Twilio (needs to be in E.164 format: +Country Code + Number)
    const formattedPhone = toPhone.startsWith('+') ? toPhone : `+${toPhone}`;

    // Send via Twilio
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+1234567890',
        To: `whatsapp:${formattedPhone}`,
        Body: message,
      }).toString(),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      console.error('[Twilio] Error:', data.message || 'Unknown error');
      return {
        success: false,
        error: data.message || 'Failed to send message',
      };
    }

    console.log('[Twilio] ✅ Message sent successfully');
    console.log(`[Twilio] SID: ${data.sid}`);

    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error: any) {
    console.error('[Twilio] Error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
