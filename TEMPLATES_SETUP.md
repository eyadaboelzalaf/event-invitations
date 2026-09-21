# Seed Default Templates

Your database needs default templates for invitations. Follow these steps:

## Step 1: Seed Templates (One-Time Setup)

Open your browser and visit:

```
http://localhost:3000/api/templates/seed?secret=admin-secret
```

You should see:
```json
{
  "message": "Templates seeded successfully",
  "count": 6
}
```

## Step 2: Verify in MongoDB Compass

1. Open **MongoDB Compass**
2. Go to: `Databases > event-invitations > templates`
3. You should see 6 templates:
   - Classic Elegant (wedding)
   - Fun & Colorful (birthday)
   - Modern Minimal (engagement)
   - Festive Gold (brit)
   - Romantic Rose (anniversary)
   - Corporate Professional (corporate)

## Step 3: Try Creating an Event Again

1. Go back to your app: `http://localhost:3000/dashboard`
2. Click "+ Create Event"
3. Fill in the form:
   - **Title:** My Wedding
   - **Event Type:** Wedding
   - **Date:** 2025-06-15
   - **Time:** 18:00
   - **Location:** Tel Aviv
4. Click "Create Event"

✅ It should work now!

---

## Why This Happened

- The form needs to select a `templateId` for the invitation
- No templates existed in the database
- Now we seeded 6 default templates so you can choose from them

---

## Troubleshooting

If you see an error when calling the seed endpoint:

1. Make sure MongoDB is connected (check Atlas connection string in `.env.local`)
2. Check that `ADMIN_SECRET=admin-secret` is in your `.env.local`
3. Try again
