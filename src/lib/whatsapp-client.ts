import { Client, LocalAuth } from 'whatsapp-web.js';

let whatsappClient: Client | null = null;
let isInitialized = false;

/**
 * Initialize WhatsApp Web client
 * Requires QR code scan on first run
 */
export async function initializeWhatsApp() {
  if (isInitialized) {
    return whatsappClient;
  }

  try {
    // Only initialize in production or if explicitly enabled
    if (process.env.WHATSAPP_ENABLED !== 'true') {
      console.log('[WhatsApp] WhatsApp disabled - using mock mode');
      return null;
    }

    whatsappClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    whatsappClient.on('qr', (qr) => {
      console.log('[WhatsApp QR] Scan this QR code to authenticate:');
      console.log(qr);
    });

    whatsappClient.on('authenticated', () => {
      console.log('[WhatsApp] ✅ Authenticated successfully!');
    });

    whatsappClient.on('auth_failure', (msg) => {
      console.error('[WhatsApp] ❌ Authentication failed:', msg);
    });

    whatsappClient.on('ready', () => {
      console.log('[WhatsApp] ✅ Client is ready!');
      isInitialized = true;
    });

    whatsappClient.on('disconnected', (reason) => {
      console.log('[WhatsApp] ❌ Client disconnected:', reason);
      isInitialized = false;
    });

    await whatsappClient.initialize();
    return whatsappClient;
  } catch (error) {
    console.error('[WhatsApp] Failed to initialize:', error);
    return null;
  }
}

/**
 * Send WhatsApp message to a phone number
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Format phone number for WhatsApp
    // Ensure it's in format: 972512345678 (without +)
    const formattedPhone = phone.replace(/^\+/, '').replace(/\D/g, '');

    const client = await initializeWhatsApp();

    if (!client || !isInitialized) {
      console.log('[WhatsApp] Mock mode - Message logged but not sent');
      console.log(`[WhatsApp Mock] To: ${phone}`);
      console.log(`[WhatsApp Mock] Message: ${message}`);
      return {
        success: true,
        messageId: `mock_${Date.now()}`,
      };
    }

    // Send message via WhatsApp Web
    const chatId = `${formattedPhone}@c.us`;
    const response = await client.sendMessage(chatId, message);

    console.log('[WhatsApp] ✅ Message sent successfully');
    console.log(`[WhatsApp] ID: ${response.id.id}`);

    return {
      success: true,
      messageId: response.id.id,
    };
  } catch (error: any) {
    console.error('[WhatsApp] ❌ Failed to send message:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Check if WhatsApp client is ready
 */
export function isWhatsAppReady(): boolean {
  return isInitialized && whatsappClient !== null;
}

/**
 * Get WhatsApp client
 */
export function getWhatsAppClient(): Client | null {
  return whatsappClient;
}
