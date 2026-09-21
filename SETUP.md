# Setup Guide - Event Invitations App

## Prerequisites ✅

- **Node.js** 18.17+ ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** (מקומי או MongoDB Atlas)
- **Git** (optional, for version control)

## Step 1: Clone/Extract Project

```bash
# If you have the files already
cd C:\projects\event-invitations

# Or if cloning from git
git clone <your-repo-url>
cd event-invitations
```

## Step 2: Install Dependencies

```bash
npm install

# Or using yarn
yarn install
```

This will install all required packages from `package.json`.

## Step 3: Setup MongoDB

### Option A: Local MongoDB

1. **Download MongoDB Community Edition**
   - Go to https://www.mongodb.com/try/download/community
   - Select your OS and download
   - Install with default settings

2. **Start MongoDB**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   brew services start mongodb-community
   ```

3. **Verify connection**
   ```bash
   mongo
   # Should connect successfully
   # Type: exit to quit
   ```

### Option B: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up free
   - Create a new project

2. **Create Cluster**
   - Click "Create Cluster"
   - Select shared tier (free)
   - Choose your region (closest to you)
   - Click "Create Cluster"

3. **Setup Security**
   - Add database user (e.g., `admin` / `password123`)
   - Add your IP address to whitelist
   - Or add `0.0.0.0/0` to allow all IPs (not recommended for production)

4. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, `<dbname>` with your values

## Step 4: Environment Configuration

### Create `.env.local` file

```bash
# In the root directory of the project
cp .env.local.example .env.local
```

### Edit `.env.local`

```env
# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/event-invitations

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-invitations?retryWrites=true&w=majority

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-$(date +%s)

# WhatsApp / Twilio Configuration (Optional for now)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
ADMIN_SECRET=admin-secret-for-seed-routes
```

## Step 5: Setup Admin Secret

Generate a secure random string for ADMIN_SECRET:

```bash
# Windows (PowerShell)
[System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32) | ForEach-Object { '{0:x2}' -f $_ } -join ''

# macOS/Linux
openssl rand -hex 32
```

## Step 6: Initialize Database (Seed Default Templates)

Before running the app, you need to seed the default templates:

```bash
# Make a POST request to seed templates
curl -X POST http://localhost:3000/api/templates/seed \
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \
  -H "Content-Type: application/json"
```

Or run this after starting the dev server.

## Step 7: Start Development Server

```bash
npm run dev

# Or with yarn
yarn dev
```

The app should now be running at: **http://localhost:3000**

## Step 8: Test the Application

### 1. Visit Home Page
- Open http://localhost:3000
- You should see the landing page

### 2. Register a User
- Click "Get Started" or go to http://localhost:3000/register
- Fill in:
  - Email: test@example.com
  - Password: Password123!
  - Name: Test User
  - Phone: +1234567890
  - Language: English
- Click "Register"

### 3. Login
- Go to http://localhost:3000/login
- Enter your credentials
- You should be logged in

### 4. Create an Event (When Frontend is Ready)
- Navigate to create event
- Select event type
- Choose template
- Add event details
- Upload contacts

## WhatsApp Setup (Optional)

### Setup Twilio

1. **Create Twilio Account**
   - Go to https://www.twilio.com
   - Sign up for free account
   - Verify your phone number

2. **Get WhatsApp Access**
   - Go to Twilio Console → Messaging → Try it out → WhatsApp
   - Request WhatsApp Business Account approval
   - Get your Twilio WhatsApp phone number

3. **Update Environment Variables**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
   ```

4. **Test WhatsApp Send**
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/send \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "+1234567890",
       "message": "Test message"
     }'
   ```

## Build for Production

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### 2. Start Production Server

```bash
npm start
```

Or deploy directly to Vercel:

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Make sure MongoDB is running (`mongod` command)
- Check connection string in `.env.local`
- For Atlas, verify IP whitelist and credentials

### Port 3000 Already in Use
```
Port 3000 is already in use
```
**Solution**:
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or use a different port: `npm run dev -- -p 3001`

### .env.local Not Being Read
**Solution**:
- Restart the development server
- Make sure `.env.local` is in the root directory
- Never commit `.env.local` to git

### Zod Validation Errors
- Check API request payload matches schema
- Validate email format
- Phone number must be in E.164 format (+1234567890)

### bcryptjs Issues
- If bcryptjs fails to build, run:
  ```bash
  npm install --save-optional bcryptjs
  ```

## Development Tools

### MongoDB GUI Tools
- **MongoDB Compass** - Official GUI (https://www.mongodb.com/products/compass)
- **Studio 3T** - Full-featured IDE
- **NoSQLBooster** - Query builder

### API Testing
- **Postman** - API testing and documentation
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "mongodb.mongodb-vscode",
    "GitHub.copilot"
  ]
}
```

## Project Structure Quick Reference

```
event-invitations/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities (db connection, etc)
│   ├── models/           # Mongoose schemas
│   ├── messages/         # i18n translations
│   ├── store/            # Zustand state management
│   └── styles/           # CSS files
├── public/               # Static assets
├── .env.local           # Environment variables (not in git)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind config
├── next.config.js       # Next.js config
└── README.md            # Project documentation
```

## Running Commands

### Development
```bash
npm run dev              # Start dev server on localhost:3000
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
# Connect to local MongoDB
mongo

# Connect to MongoDB Atlas (replace URL)
mongo "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
```

### Deployment
```bash
vercel login             # Login to Vercel
vercel                   # Deploy preview
vercel --prod            # Deploy to production
```

## Next Steps

1. ✅ Setup complete!
2. 🚀 Run `npm run dev` to start development
3. 📚 Read `ARCHITECTURE.md` for system design
4. 💻 Create frontend components (pages, forms)
5. 🧪 Test API endpoints with Postman
6. 🌍 Deploy to Vercel when ready

## Support

For issues or questions:
1. Check this guide again
2. Read error messages carefully
3. Check MongoDB logs
4. Review environment variables
5. Open a GitHub issue

---

**Happy coding! 🎉**
