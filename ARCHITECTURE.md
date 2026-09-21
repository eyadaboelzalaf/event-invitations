# Event Invitations App - Architecture Documentation

## Overview

אפליקציה מלאה של Next.js עבור ניהול והזמנה לאירועים עם תמיכה ברובוטיקה ב-WhatsApp, MongoDB, וייצוג מרובה שפות.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer (Frontend)            │
│          Next.js 14 + React + Tailwind CSS            │
│                                                      │
│  ├─ Authentication Pages (Login/Register)            │
│  ├─ Event Management Dashboard                       │
│  ├─ Template Selection                               │
│  ├─ Contact Upload & Management                      │
│  ├─ Preview & Customization                          │
│  └─ Schedule & Send Interface                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP/REST
                   │
┌──────────────────▼──────────────────────────────────┐
│                 API Layer (Backend)                  │
│              Next.js API Routes                      │
│                                                      │
│  ├─ /api/auth/* - Authentication & Authorization    │
│  ├─ /api/events/* - Event CRUD Operations           │
│  ├─ /api/templates/* - Template Management          │
│  ├─ /api/contacts/* - Contact Management            │
│  └─ /api/whatsapp/* - WhatsApp Integration          │
└──────────────────┬──────────────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
     ▼             ▼             ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ MongoDB │  │ Twilio   │  │ External │
│ Database│  │ WhatsApp │  │ Services │
└─────────┘  └──────────┘  └──────────┘
```

## Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed with bcryptjs),
  name: String,
  phone: String,
  language: "he" | "en" | "ar",
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  title: String,
  type: "wedding" | "birthday" | "engagement" | "brit" | 
         "anniversary" | "corporate",
  eventDate: Date,
  eventTime: String (HH:MM format),
  location: String,
  description: String,
  templateId: ObjectId (ref Template),
  customizations: {
    colors: { primary, secondary, background, text },
    fonts: { heading, body },
    layout: String,
    additionalFields: Any
  },
  contacts: [ObjectId] (ref Contact),
  sendDate: Date (optional),
  sendTime: String (optional),
  status: "draft" | "preview" | "scheduled" | "sent",
  createdAt: Date,
  updatedAt: Date
}
```

### Template Collection
```typescript
{
  _id: ObjectId,
  name: String,
  eventType: "wedding" | "birthday" | "engagement" | 
             "brit" | "anniversary" | "corporate",
  content: String (HTML/JSX),
  design: {
    colors: {
      primary: String (hex color),
      secondary: String,
      background: String,
      text: String
    },
    fonts: {
      heading: String,
      body: String
    },
    layout: String
  },
  language: "he" | "en" | "ar",
  isDefault: Boolean,
  createdAt: Date
}
```

### Contact Collection
```typescript
{
  _id: ObjectId,
  eventId: ObjectId (ref Event),
  name: String,
  phone: String (E.164 format),
  status: "pending" | "confirmed" | "declined",
  attendees: Number,
  messageId: String (WhatsApp message ID),
  createdAt: Date,
  updatedAt: Date
}
```

## API Routes Structure

### Authentication Routes
```
POST /api/auth/register
  - Input: { email, password, name, phone, language }
  - Output: { user, message }

POST /api/auth/login
  - Input: { email, password }
  - Output: { user, message }

POST /api/auth/logout
  - Output: { message }

GET /api/auth/me
  - Output: { user }
```

### Event Routes
```
GET /api/events
  - Query: none (gets all for current user)
  - Output: [Event]

GET /api/events/[id]
  - Output: Event

POST /api/events
  - Input: { title, type, eventDate, eventTime, location, 
             description, templateId, customizations }
  - Output: Event

PUT /api/events/[id]
  - Input: { ...EventFields }
  - Output: Event

DELETE /api/events/[id]
  - Output: { message }

PUT /api/events/[id]/status
  - Input: { status: "draft"|"preview"|"scheduled"|"sent" }
  - Output: Event
```

### Template Routes
```
GET /api/templates
  - Query: { eventType?, language? }
  - Output: [Template]

GET /api/templates/[id]
  - Output: Template

POST /api/templates (Admin only)
  - Input: { name, eventType, content, design, language, isDefault }
  - Output: Template

POST /api/templates/seed (Admin only)
  - Output: { message, count }
```

### Contact Routes
```
GET /api/contacts
  - Query: { eventId }
  - Output: [Contact]

POST /api/contacts
  - Input: { eventId, name, phone } or [array]
  - Output: Contact | [Contact]

PUT /api/contacts/[id]
  - Input: { status, attendees }
  - Output: Contact

DELETE /api/contacts/[id]
  - Output: { message }
```

### WhatsApp Routes
```
POST /api/whatsapp/send
  - Input: { eventId, contactId, phone, message, invitationUrl }
  - Output: { messageId, success }

POST /api/whatsapp/webhook
  - Input: WhatsApp webhook payload
  - Output: { success }

GET /api/whatsapp/status/[messageId]
  - Output: { status, timestamp }
```

## Flow Diagrams

### User Registration Flow
```
┌─────────────┐
│ User Input  │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Validate Input   │
│ (Zod Schema)     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Check Duplicate  │
│ Email            │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Hash Password    │
│ (bcryptjs)       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Save to MongoDB  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Return User      │
│ (No password)    │
└──────────────────┘
```

### Event Creation & WhatsApp Send Flow
```
┌──────────────────┐
│ Create Event     │
│ with Template    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save to DB       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Upload Contacts  │
│ (CSV/Excel)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Preview          │
│ Invitation       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send Test        │
│ via WhatsApp     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Schedule Send    │
│ Date/Time        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Queue Messages   │
│ (Background Job) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send via Twilio  │
│ WhatsApp API     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update Contact   │
│ Status           │
└──────────────────┘
```

## State Management

### Zustand Store Structure
```typescript
useAppStore {
  // User State
  user: User | null
  isAuthenticated: boolean
  setUser()
  setIsAuthenticated()
  
  // Events State
  events: Event[]
  currentEvent: Event | null
  setEvents()
  setCurrentEvent()
  addEvent()
  updateEvent()
  deleteEvent()
  
  // UI State
  currentStep: number
  isLoading: boolean
  error: string | null
  setCurrentStep()
  setIsLoading()
  setError()
  
  // Language State
  language: 'he' | 'en' | 'ar'
  setLanguage()
}
```

## i18n Implementation

### Language Support
- **Hebrew** - עברית (RTL)
- **English** - English (LTR)
- **Arabic** - العربية (RTL)

### Message Structure
```
/src/messages/
├── he.json    # Hebrew translations
├── en.json    # English translations
└── ar.json    # Arabic translations
```

Each file contains nested keys:
```json
{
  "common": { ... },
  "auth": { ... },
  "events": { ... },
  "templates": { ... },
  "contacts": { ... },
  "preview": { ... },
  "schedule": { ... }
}
```

## Security Considerations

### 1. Password Security
- Passwords hashed using bcryptjs with salt rounds = 10
- Never stored or transmitted in plain text
- Validated with minimum length requirements

### 2. API Security
- User ID validation on protected routes via headers
- Input validation using Zod schemas
- CORS configured for allowed origins
- Rate limiting recommended for production

### 3. Data Privacy
- Phone numbers in E.164 format for WhatsApp API
- Personal data only shared with consent
- GDPR compliance considerations

### 4. Environment Variables
- Sensitive data in .env.local
- Never commit to version control
- Use .env.example for documentation

## WhatsApp Integration (Twilio)

### Setup Steps
1. Create Twilio account
2. Get WhatsApp Business Account approval
3. Get Twilio WhatsApp Number
4. Store credentials in environment variables

### Message Flow
```
1. User creates event with contacts
2. System generates invitation link/message
3. Message queued for sending
4. Twilio API sends WhatsApp message
5. Webhook receives delivery status
6. Contact receives message + link
7. Contact clicks link, sees RSVP options
8. Response saved to database
```

### Example WhatsApp Message
```
🎉 You're invited!

Event: [Event Title]
Date: [Event Date]
Time: [Event Time]
Location: [Event Location]

Confirm your attendance:
[Link to RSVP page]

[Custom message from organizer]
```

## Deployment

### Vercel Deployment
```
vercel deploy --prod
```

### Environment Setup
1. Add MongoDB connection string
2. Configure NextAuth secret
3. Add Twilio credentials
4. Set admin secret for seed routes

### Production Checklist
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] Error logging setup
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Security headers added
- [ ] Database indexes optimized

## Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- CSS-in-JS optimization with Tailwind
- Client-side caching strategies

### Backend
- MongoDB indexes on frequently queried fields
- Database connection pooling
- API response caching
- Batch processing for bulk sends

### Database Indexes
```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true })

// Event indexes
db.events.createIndex({ userId: 1, createdAt: -1 })

// Contact indexes
db.contacts.createIndex({ eventId: 1, phone: 1 })

// Template indexes
db.templates.createIndex({ eventType: 1, language: 1 })
```

## Testing Strategy

### Unit Tests
- Zod validation schemas
- Auth utility functions
- Store actions

### Integration Tests
- API routes with mock database
- Auth flow (register → login)
- Event CRUD operations

### E2E Tests
- Complete user flow
- WhatsApp integration
- Report generation

## Future Enhancements

1. **Payment Integration**
   - Stripe for event invitations pricing
   - Subscription plans

2. **Analytics**
   - RSVP metrics
   - Engagement tracking
   - Guest list analytics

3. **Advanced Features**
   - Email fallback
   - SMS notifications
   - Guest list sharing
   - Photo upload in invitations
   - Video messages

4. **Admin Panel**
   - User management
   - Template management
   - Analytics dashboard
   - Support tickets

5. **Mobile App**
   - React Native version
   - Offline support
   - Push notifications

---

**Last Updated**: 2024
**Version**: 1.0.0
