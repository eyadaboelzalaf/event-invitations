# WhatsApp Integration Setup

This app supports **WhatsApp Web.js** for sending real WhatsApp messages!

---

## 🚀 Quick Start (Mock Mode - Default)

By default, the app runs in **MOCK MODE**:
- Messages are logged to console
- No real WhatsApp messages sent
- Perfect for testing UI/flow
- No setup required ✅

### To Test in Mock Mode:
1. Go to event preview page
2. Enter any phone number
3. Click "Send Test"
4. Check server console for logged message

---

## 📱 Enable Real WhatsApp Sending

To send **REAL WhatsApp messages**, follow these steps:

### Step 1: Install Dependencies

```bash
npm install whatsapp-web.js qrcode-terminal puppeteer
```

This will take 5-10 minutes (large dependencies).

### Step 2: Update `.env.local`

Add this line to your `.env.local`:

```env
WHATSAPP_ENABLED=true
```

### Step 3: Start the App

```bash
npm run dev
```

### Step 4: Scan QR Code

When you start the server, you'll see output like:

```
[WhatsApp QR] Scan this QR code to authenticate:
[QR CODE WILL APPEAR HERE]
```

**On your phone:**
1. Open WhatsApp
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code shown in your terminal

### Step 5: Wait for Authentication

You'll see:
```
[WhatsApp] ✅ Authenticated successfully!
[WhatsApp] ✅ Client is ready!
```

### Step 6: Send Messages!

Now when you send a test message:
- Real WhatsApp message goes to the phone number
- Appears in WhatsApp chat
- Message delivered via WhatsApp Web automation

---

## ⚠️ Important Notes

### Account Ban Risk
- WhatsApp does not officially support web.js
- Account could be banned if WhatsApp detects automation
- **Use at your own risk**
- Don't spam messages
- Only use for legitimate event invitations

### Performance
- Slower than official API (Twilio)
- Requires browser automation overhead
- Not recommended for high-volume sending
- Better for small-scale event invitations

### Session Persistence
- QR code scan is saved locally
- You only need to scan once
- Session persists across restarts

### Phone Requirements
- Need a phone with WhatsApp installed
- Keep phone connected to internet while server runs
- Can't use the WhatsApp account elsewhere if session is active

---

## 🔄 Switching Between Mock and Real

### To Use Mock Mode (Default):
```env
# In .env.local - comment out or remove:
# WHATSAPP_ENABLED=true
```

Then restart: `npm run dev`

### To Use Real WhatsApp:
```env
# In .env.local - add:
WHATSAPP_ENABLED=true
```

Then restart: `npm run dev`

---

## 🚨 Troubleshooting

### "whatsapp-web.js module not found"
Solution: Run `npm install whatsapp-web.js qrcode-terminal puppeteer`

### QR code not appearing
Solution: Check your terminal for `[WhatsApp QR]` - might be cut off by logs

### "Client disconnected"
Solution: Phone lost internet or WhatsApp session expired. Restart server and rescan QR.

### Messages not sending
Solution:
1. Ensure `WHATSAPP_ENABLED=true` in `.env.local`
2. Check that phone is online
3. Verify phone number format (with country code)
4. Check server logs for errors

---

## 📋 Future: Migrate to Twilio

When you're ready for production, switch to **Twilio**:
- Official API
- No ban risk
- Paid ($0.008/message)
- Reliable & fast
- Better for high volume

Migration is easy - just update the `sendWhatsAppMessage` function!

---

## 📚 Resources

- **whatsapp-web.js**: https://github.com/pedroslopez/whatsapp-web.js
- **Puppeteer**: https://pptr.dev/
- **Twilio**: https://www.twilio.com/whatsapp

---

**Enjoy sending WhatsApp invitations!** 🎉
