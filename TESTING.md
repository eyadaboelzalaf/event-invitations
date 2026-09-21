# Testing & Deployment Guide

## 🧪 Testing Strategy

### Phase 1: Local Development Testing

```bash
cd C:\projects\event-invitations
npm run dev
```

**What to test:**
- ✅ Home page loads (http://localhost:3000)
- ✅ API endpoints respond
- ✅ Database connection works
- ✅ No console errors

### Phase 2: Build Testing

```bash
npm run build
```

**What to check:**
- ✅ Build completes without errors
- ✅ All TypeScript types are correct
- ✅ No warnings in build output

### Phase 3: Production Mode Testing

```bash
npm start
```

**What to test:**
- ✅ App runs on http://localhost:3000
- ✅ Performance is good
- ✅ No runtime errors

---

## 🧪 API Testing with Postman

### 1. **Download Postman**
https://www.postman.com/downloads/

### 2. **Create Collection**
Import these endpoints:

#### **Authentication**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "name": "Test User",
  "phone": "+1234567890",
  "language": "en"
}
```

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

#### **Events**
```
GET http://localhost:3000/api/events
Header: x-user-id: <user-id-from-register>
```

```
POST http://localhost:3000/api/events
Header: x-user-id: <user-id>
Content-Type: application/json

{
  "title": "My Wedding",
  "type": "wedding",
  "eventDate": "2025-06-15T18:00:00Z",
  "eventTime": "18:00",
  "location": "Tel Aviv",
  "description": "A beautiful wedding celebration",
  "templateId": "template-id-here",
  "customizations": {}
}
```

#### **Templates**
```
GET http://localhost:3000/api/templates?eventType=wedding&language=en
```

#### **Contacts**
```
GET http://localhost:3000/api/contacts?eventId=event-id
```

```
POST http://localhost:3000/api/contacts
Content-Type: application/json

[
  {
    "eventId": "event-id",
    "name": "John Doe",
    "phone": "+1234567890"
  }
]
```

---

## 🌐 Deployment to Vercel

### Step 1: Prepare GitHub Repository

```bash
cd C:\projects\event-invitations

# Make sure everything is committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select `event-invitations` repository
5. Click "Import"

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add these variables:

```
MONGODB_URI = your-mongodb-atlas-connection-string
NEXTAUTH_SECRET = generate-with: openssl rand -hex 32
NEXTAUTH_URL = https://your-app.vercel.app
TWILIO_ACCOUNT_SID = your-twilio-sid
TWILIO_AUTH_TOKEN = your-twilio-token
TWILIO_WHATSAPP_NUMBER = whatsapp:+1234567890
NODE_ENV = production
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. View your live app at `https://your-app.vercel.app`

---

## 🔍 Testing Checklist

### Before Vercel Deployment

- [ ] `npm install` works without errors
- [ ] `npm run dev` starts successfully
- [ ] Home page loads at http://localhost:3000
- [ ] API endpoints respond correctly
- [ ] Database connection works
- [ ] `npm run build` completes without errors
- [ ] `npm start` runs in production mode
- [ ] No console errors or warnings
- [ ] All environment variables are set
- [ ] Code is committed to GitHub

### After Vercel Deployment

- [ ] Live URL is accessible
- [ ] Home page loads
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] No errors in Vercel logs
- [ ] Performance is acceptable

---

## 📊 Common Issues & Solutions

### Issue: MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running locally
- Or use MongoDB Atlas for production
- Check MONGODB_URI in .env.local

### Issue: Build Fails on Vercel

```
Error: next build failed
```

**Solution:**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Fix TypeScript errors locally first
- Run `npm run build` locally to debug

### Issue: Env Variables Not Set

```
Error: MONGODB_URI is undefined
```

**Solution:**
- Add variables in Vercel Dashboard
- Not in .env.local file
- Redeploy after setting variables

### Issue: API Returns 401 Unauthorized

**Solution:**
- Pass `x-user-id` header in requests
- Or implement proper NextAuth.js

---

## 🚀 Deployment Comparison

| Aspect | Local | Vercel |
|--------|-------|--------|
| Cost | Free | Free (up to limits) |
| Speed | Fast | Very Fast (CDN) |
| Uptime | Manual | 99.9% |
| Scaling | Limited | Auto-scaling |
| Database | Local MongoDB | MongoDB Atlas |
| SSL | None | Automatic HTTPS |

---

## 📈 Production Checklist

Before going to production:

- [ ] All tests pass locally
- [ ] Environment variables are secure
- [ ] MongoDB is on MongoDB Atlas (not local)
- [ ] Error logging is set up
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] Security headers are set
- [ ] Database backups are enabled

---

## 🎯 Next Steps

1. **Test Locally First** (this week)
2. **Set up MongoDB Atlas** (free tier)
3. **Deploy to Vercel** (1 click)
4. **Test on Live URL** (verify everything works)
5. **Build Frontend** (next phase)
6. **Add More Features** (phase by phase)

---

## 📞 Support

If you encounter issues:

1. Check the error message carefully
2. Look at console/build logs
3. Search GitHub issues
4. Verify environment variables
5. Try local testing first

---

**Ready to test? Let's go! 🚀**
