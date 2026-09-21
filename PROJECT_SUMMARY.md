# Event Invitations App - Project Summary

## 📋 Project Overview

אפליקציית ניהול הזמנות לאירועים מלאה וממוקדת, המאפשרת למשתמשים ליצור, להתאים אישית וליעל הזמנות לאירועים שונים דרך WhatsApp.

**משימה ראשונה**: אתה בעל אירועים שרוצה לשלוח הזמנות יפות וממותגות ללא צורך בקוד.

## 🎯 Core Features

### 1️⃣ User Management
- ✅ הרשמה ללחישה עם אימות
- ✅ התחברות בטוחה עם bcryptjs
- ✅ ניהול פרופיל משתמש
- ✅ תמיכה בשלוש שפות (עברית, אנגלית, ערבית)

### 2️⃣ Event Management
- ✅ יצירת אירועים ממובחר (חתונה, יום הולדת, אירוסין, ברית, יום נישואים, אירוע קורפורטיבי)
- ✅ הזנת פרטים מלאים (תאריך, שעה, מיקום, תיאור)
- ✅ עריכה ומחיקה של אירועים
- ✅ מעקב אחרי סטטוס (טיוטה, תצוגה מקדימה, מתוזמנת, שנשלחה)

### 3️⃣ Template System
- ✅ ספרייה של תבניות מוגדרות מראש לכל סוג אירוע
- ✅ בחירה מתבניות הברירה המחדל
- ✅ העלאה של תבניות מותאמות משלך (HTML/CSS)
- ✅ התאמה אישית של צבעים, גופנים, תבנית

### 4️⃣ Contact Management
- ✅ העלאת קבצי אנשי קשר (CSV/Excel)
- ✅ הוספה ידנית של אנשי קשר
- ✅ מחיקה וערכת של אנשי קשר
- ✅ ניהול סטטוסים (תלויים, אישור, דחייה)

### 5️⃣ Preview & Customization
- ✅ תצוגה מקדימה בזמן אמת של ההזמנה
- ✅ שליחת בדיקה לטלפון שלך
- ✅ עריכה של מפרטי ההזמנה
- ✅ התאמה אישית של הודעה

### 6️⃣ WhatsApp Integration
- ✅ שיתוף פעולה עם Twilio WhatsApp API
- ✅ שליחה ישירה של הזמנות ל-WhatsApp
- ✅ קישור ל-RSVP בהזמנה
- ✅ עקיבות אחרי מצב ההודעה

### 7️⃣ RSVP Management
- ✅ קישור ייחודי עבור כל איש קשר
- ✅ אפשרות לאשר או לדחות הגעה
- ✅ בחירת מספר משתתפים
- ✅ עדכון סטטוסים בזמן אמת

### 8️⃣ Scheduling & Sending
- ✅ קביעת תאריך ושעה לשליחה
- ✅ שליחה דחויה (כמו scheduler)
- ✅ שליחה קבוצתית לכל האנשים
- ✅ בדיקה של שליחות

## 🛠️ Technology Stack

```
Frontend:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Hook Form
  - Zustand (State Management)
  - next-intl (Internationalization)

Backend:
  - Next.js API Routes
  - Node.js
  - Express-like routing

Database:
  - MongoDB
  - Mongoose (ODM)

Authentication:
  - bcryptjs (Password hashing)
  - Custom JWT/Session (יישום בעתיד)

APIs & Services:
  - Twilio WhatsApp API
  - Vercel Hosting

Validation:
  - Zod (Schema validation)

Styling:
  - Tailwind CSS
  - PostCSS

Tools:
  - TypeScript
  - ESLint
  - Prettier (recommended)
```

## 📁 Project Structure

```
event-invitations/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── [locale]/          # i18n routing
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── events/
│   │   ├── ui/
│   │   └── common/
│   ├── lib/                   # Utility functions
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── whatsapp.ts
│   │   └── validators.ts
│   ├── models/                # Mongoose schemas
│   ├── store/                 # Zustand store
│   ├── messages/              # i18n translations
│   └── styles/                # CSS files
├── public/                    # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── Documentation files (README, SETUP, ARCHITECTURE, etc)
```

## 🔧 Installation & Setup

### Quick Start (5 דקות)

```bash
# 1. Navigate to project
cd C:\projects\event-invitations

# 2. Install dependencies
npm install

# 3. Setup .env.local
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and other configs

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

### Full Setup Guide
See: **SETUP.md**

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `README.md` | Features overview and quick start |
| `SETUP.md` | Detailed installation and configuration |
| `ARCHITECTURE.md` | System design and database schema |
| `DEVELOPMENT.md` | Coding standards and development guide |
| `PROJECT_SUMMARY.md` | This file |

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel login
vercel deploy --prod
```

### Manual Deployment
1. Build: `npm run build`
2. Start: `npm start`
3. Configure environment variables on hosting platform

## 📊 Database Models

### User
```
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  language: 'he' | 'en' | 'ar',
  createdAt: Date
}
```

### Event
```
{
  userId: ObjectId,
  title: String,
  type: EventType,
  eventDate: Date,
  eventTime: String,
  location: String,
  description: String,
  templateId: ObjectId,
  customizations: Object,
  contacts: [ObjectId],
  sendDate: Date,
  sendTime: String,
  status: 'draft' | 'preview' | 'scheduled' | 'sent'
}
```

### Template
```
{
  name: String,
  eventType: EventType,
  content: String (HTML),
  design: { colors, fonts, layout },
  language: 'he' | 'en' | 'ar',
  isDefault: Boolean
}
```

### Contact
```
{
  eventId: ObjectId,
  name: String,
  phone: String (E.164),
  status: 'pending' | 'confirmed' | 'declined',
  attendees: Number,
  messageId: String
}
```

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Input validation with Zod
- ✅ API authentication via headers
- ✅ Environment variable protection
- ✅ MongoDB connection pooling
- ✅ Rate limiting ready (for production)

## 🌍 Internationalization

### Supported Languages
- 🇮🇱 Hebrew (עברית) - RTL
- 🇬🇧 English - LTR
- 🇸🇦 Arabic (العربية) - RTL

### Translation Files
- `src/messages/he.json` - Hebrew translations
- `src/messages/en.json` - English translations
- `src/messages/ar.json` - Arabic translations

## 📱 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

### Events
```
GET    /api/events
GET    /api/events/[id]
POST   /api/events
PUT    /api/events/[id]
DELETE /api/events/[id]
```

### Templates
```
GET    /api/templates?eventType=&language=
GET    /api/templates/[id]
POST   /api/templates/seed (admin)
```

### Contacts
```
GET    /api/contacts?eventId=
POST   /api/contacts
PUT    /api/contacts/[id]
DELETE /api/contacts/[id]
```

### WhatsApp
```
POST   /api/whatsapp/send
POST   /api/whatsapp/webhook
GET    /api/whatsapp/status/[messageId]
```

## 💡 Key Concepts

### Event Flow
```
1. User registers & logs in
2. Creates new event with details
3. Selects or uploads template
4. Uploads list of contacts
5. Previews invitation
6. Sends test via WhatsApp
7. Schedules sending date/time
8. System sends to all contacts
9. Contacts receive WhatsApp message
10. Contacts confirm/decline via link
11. Owner sees updated RSVP list
```

### State Management (Zustand)
```
useAppStore:
  - User authentication state
  - Current events and selections
  - UI state (loading, errors, steps)
  - Language preference
```

### Internationalization (next-intl)
```
- Automatic locale detection
- RTL/LTR support
- Dynamic language switching
- Translation file organization
```

## ⚡ Performance Considerations

- ✅ Code splitting with dynamic imports
- ✅ Image optimization
- ✅ CSS bundling with Tailwind
- ✅ Database indexing
- ✅ API response caching
- ✅ Lazy loading components

## 🧪 Testing (To Implement)

```
Unit Tests: API routes, validators, utilities
Integration Tests: Auth flow, event CRUD
E2E Tests: Complete user journeys
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Ensure MongoDB is running, check .env.local |
| Port 3000 already in use | Use `npm run dev -- -p 3001` |
| .env.local not reading | Restart dev server |
| Import errors | Check file paths and TypeScript config |

## 📈 Future Enhancements

### Phase 2
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] SMS fallback
- [ ] Guest list sharing
- [ ] Photo uploads

### Phase 3
- [ ] Analytics dashboard
- [ ] Guest filtering
- [ ] Template editor UI
- [ ] Export reports
- [ ] Mobile app (React Native)

## 📞 Support Resources

- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com
- Zod Validation: https://zod.dev
- Zustand: https://github.com/pmndrs/zustand
- next-intl: https://next-intl-docs.vercel.app

## 📝 Development Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint

# Database
npm run db:seed            # Seed default templates

# Deployment
vercel deploy --prod       # Deploy to production
```

## 🎓 Learning Path

1. **Basics**: Read README.md and SETUP.md
2. **Architecture**: Review ARCHITECTURE.md
3. **Development**: Follow DEVELOPMENT.md guidelines
4. **Hands-on**: Start with frontend components
5. **Testing**: Implement unit and integration tests
6. **Optimization**: Profile and optimize performance

## 📅 Project Milestones

- ✅ **Week 1**: Setup, models, and API routes
- ⏳ **Week 2**: Frontend pages and forms
- ⏳ **Week 3**: WhatsApp integration
- ⏳ **Week 4**: Testing and deployment

## 🎉 Project Readiness

### Development Phase: 75%
- ✅ Backend infrastructure complete
- ✅ Database models defined
- ✅ API routes implemented
- ✅ Authentication logic ready
- ⏳ Frontend components (in progress)
- ⏳ UI refinement
- ⏳ Testing

### Production Ready: 30%
- ⏳ Comprehensive testing
- ⏳ Performance optimization
- ⏳ Security hardening
- ⏳ Documentation completion
- ⏳ Deployment preparation

## 👥 Team & Roles

- **Lead Developer**: Building full stack
- **Frontend**: React components and pages
- **Backend**: API routes and database
- **DevOps**: Deployment and monitoring

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Next.js team for the framework
- MongoDB for the database
- Tailwind Labs for styling
- All open-source contributors

---

## Quick Links

- 🏠 [Home](README.md)
- ⚙️ [Setup Guide](SETUP.md)
- 🏗️ [Architecture](ARCHITECTURE.md)
- 💻 [Development](DEVELOPMENT.md)
- 📊 [Project Summary](PROJECT_SUMMARY.md)

---

**Last Updated**: December 2024
**Status**: Active Development
**Version**: 1.0.0-alpha

**Built with ❤️ for beautiful event invitations**
