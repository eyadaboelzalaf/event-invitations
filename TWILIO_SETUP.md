# Twilio WhatsApp Integration

Simple, clean WhatsApp integration using Twilio API.

---

## 🚀 Quick Start

### Default: Mock Mode (No Setup)

By default, the app runs in **mock mode** - messages are logged to console, not actually sent. Perfect for testing!

Go to your event preview page and send a test message. You'll see it logged in your terminal. ✅

### Real WhatsApp: Enable Twilio

To send **REAL WhatsApp messages**, follow these 3 steps:

---

## 📋 **Step 1: Create Twilio Account (5 minutes)**

1. Go to: https://www.twilio.com/try-twilio
2. Sign up with your email
3. Verify your phone number (they'll call/SMS)
4. Add a credit card (free $15 trial, no charges yet)
5. You're done! ✅

---

## 🔑 **Step 2: Get Twilio Credentials (2 minutes)**

1. Go to: https://console.twilio.com
2. Copy your **Account SID** (looks like: `ACxxxxxxxxxxxxxxxxxxxxxxxx`)
3. Copy your **Auth Token** (looks like: `your_auth_token_here`)
4. Go to: https://console.twilio.com/us1/develop/phone-numbers/getting-started/whatsapp-sandbox
5. Copy your **WhatsApp Sandbox Number** (looks like: `whatsapp:+1234567890`)

---

## ⚙️ **Step 3: Configure `.env.local` (1 minute)**

On your Windows machine, edit: `C:\projects\event-invitations\.env.local`

Add these lines:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

**Replace with YOUR credentials from Step 2.**

Your `.env.local` should look like:

```env
MONGODB_URI=mongodb+srv://...
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
NEXTAUTH_URL=http://localhost:3000
...
```

Save the file.

---

## 🧪 **Step 4: Test It**

1. Restart your app: `npm run dev`
2. Go to: `http://localhost:3000/dashboard`
3. Click your event
4. Send a test message to **any WhatsApp number**
5. **Check that number's WhatsApp** - message should arrive! ✅

---

## ✅ **How It Works**

```
Your Event Invitations App
    ↓
Generates invitation message
    ↓
Sends to Twilio API
    ↓
Twilio sends via WhatsApp
    ↓
Guest receives on WhatsApp ✅
```

---

## 💰 **Pricing**

- **Free Trial**: $15 credits (~2000 messages)
- **After Trial**: $0.0079 per message (~1 cent each)
- **100 invitations** = $0.79

That's it! No monthly fees, no contracts.

---

## 🎯 **Need Help?**

### Credentials not working?
- Double-check you copied them correctly
- Make sure no extra spaces
- Check you used the right Sandbox Number (starts with `whatsapp:`)

### Message not sending?
- Check your Twilio account has credits ($15 free trial)
- Verify the phone number is correct (with country code)
- Check terminal for error messages

### Want to use your own WhatsApp Business Number?
- Follow Twilio docs to upgrade from Sandbox
- Same credentials, different number
- Costs money but no daily message limits

---

## 🚀 **That's It!**

Clean, simple, professional WhatsApp integration. No complex browser automation, just a reliable API call. 🎉
