# Event Invitations App 🎉

אפליקציה מלאה ליצירה ושליחת הזמנות לאירועים (חתונות, ימי הולדת, אירוסין וכו') דרך WhatsApp.

## Features ✨

- ✅ **הרשמה והתחברות** - רישום משתמשים עם אימות בטוח
- ✅ **יצירת אירועים** - תמיכה בחתונות, ימי הולדת, אירוסין, ברית, יום נישואים, אירועים קורפורטיביים
- ✅ **בחירת תבניות** - ספרייה של תבניות דעיכות או העלאת תבנית משלך
- ✅ **ניהול אנשי קשר** - העלאת קבצים של אנשי קשר (CSV/Excel)
- ✅ **תצוגה מקדימה** - ראה כיצד ההזמנה תיראה לפני השליחה
- ✅ **שליחה ל-WhatsApp** - שלח הזמנות דרך Twilio WhatsApp API
- ✅ **תמיכה ברישות** - תמיכה בעברית, אנגלית וערבית
- ✅ **קביעת זמן שליחה** - קבע מתי לשלוח את ההזמנות
- ✅ **ניהול RSVP** - אנשי קשר יכולים לאשר או לדחות הגעה

## Tech Stack 🛠️

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js v5 (כרגע בשימוש ידני)
- **Validation**: Zod
- **Forms**: React Hook Form
- **State Management**: Zustand
- **Internationalization**: next-intl (עברית, אנגלית, ערבית)
- **Hosting**: Vercel
- **WhatsApp API**: Twilio (עתידי)

## Installation 📦

### דרישות מקדימות
- Node.js 18+
- MongoDB (מקומי או MongoDB Atlas)
- Twilio Account (עבור WhatsApp API)

### צעדים

1. **Clone the repository**
```bash
git clone <your-repo>
cd event-invitations
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.local.example .env.local
```

ערוך את `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/event-invitations
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

4. **Run development server**
```bash
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן שלך.

## Project Structure 📁

```
event-invitations/
├── src/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth/         # Authentication
│   │   │   ├── events/       # Event CRUD
│   │   │   ├── templates/    # Template management
│   │   │   ├── contacts/     # Contact management
│   │   │   └── whatsapp/     # WhatsApp integration
│   │   ├── (auth)/           # Auth pages
│   │   ├── (dashboard)/      # Dashboard pages
│   │   ├── [locale]/         # Internationalization routing
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── db.ts             # MongoDB connection
│   │   └── auth.ts           # Auth utilities
│   ├── models/               # Database models
│   │   ├── User.ts
│   │   ├── Event.ts
│   │   ├── Template.ts
│   │   └── Contact.ts
│   ├── components/           # React components (TODO)
│   ├── messages/             # i18n translations
│   ├── styles/
│   │   └── globals.css
│   └── i18n.ts
├── public/                   # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## API Documentation 📚

### Authentication
- `POST /api/auth/register` - הרשמה
- `POST /api/auth/login` - התחברות

### Events
- `GET /api/events` - קבל את כל האירועים
- `POST /api/events` - יצור אירוע חדש
- `GET /api/events/[id]` - קבל אירוע ספציפי
- `PUT /api/events/[id]` - עדכן אירוע
- `DELETE /api/events/[id]` - מחק אירוע

### Templates
- `GET /api/templates?eventType=wedding&language=he` - קבל תבניות
- `POST /api/templates/seed` - צור תבניות ברירת מחדל

### Contacts
- `GET /api/contacts?eventId=123` - קבל אנשי קשר
- `POST /api/contacts` - הוסף איש קשר
- `PUT /api/contacts/[id]` - עדכן קביעה

### WhatsApp
- `POST /api/whatsapp/send` - שלח הזמנה ל-WhatsApp

## Development Roadmap 🚀

- [ ] Frontend components (pages, forms, previews)
- [ ] Advanced event management
- [ ] RSVP tracking dashboard
- [ ] Payment integration
- [ ] Email notifications
- [ ] SMS fallback
- [ ] Analytics & reporting
- [ ] Custom domain support

## License 📄

MIT License

## Support 💬

לשאלות או בעיות, פתח GitHub Issue.

---

**Made with ❤️ for beautiful event invitations**
