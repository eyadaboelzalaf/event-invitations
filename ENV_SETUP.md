# Environment Setup Guide

## ⚠️ IMPORTANT: Your Local `.env.local` File

Your `.env.local` file on Windows at `C:\projects\event-invitations\.env.local` needs to be updated with MongoDB Atlas credentials.

---

## 🚀 Quick Fix

### Step 1: Update Your `.env.local` File

**Edit:** `C:\projects\event-invitations\.env.local`

Replace the entire content with:

```env
# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://eyadabuelzalef_db_user:tFgWGOXICPrGakb0@cluster0.emga6fp.mongodb.net/event-invitations?appName=Cluster0

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# WhatsApp API (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
ADMIN_SECRET=admin-secret
```

### Step 2: Remove Old Localhost Reference

Make sure `.env.local` does NOT have:
```
MONGODB_URI=mongodb://localhost:27017/event-invitations
```

### Step 3: Restart Your App

```bash
npm run dev
```

### Step 4: Test Registration

Go to: `http://localhost:3000/register`

Fill in the form and click "Create Account" ✅

---

## 📋 What Changed

- ❌ **Removed:** `mongodb://localhost:27017/event-invitations` (local MongoDB)
- ✅ **Added:** MongoDB Atlas connection string with your credentials
- ✅ All other variables configured for development

---

## ⚡ Summary

- You have **Compass installed** (database viewer only)
- You do **NOT** have local MongoDB running
- You're using **MongoDB Atlas** (cloud database)
- Your `.env.local` needs the **Atlas connection string**

That's it! Just update the file and restart. 🚀
