# Frontend Setup Guide

Due to git limitations with special characters on Windows, you need to create some files manually. Here's how:

## Step 1: Run the Folder Setup Script

```bash
# From your project root, run:
setup-folders.bat
```

This creates all necessary folder structure.

## Step 2: Copy Frontend Files

I've provided all the code below. Create each file in its corresponding location:

### UI Components

#### src/components/ui/Input.tsx
```typescript
[See Input.tsx in the git repo or GitHub - copy from there]
```

#### src/components/ui/Select.tsx
```typescript
[See Select.tsx in the git repo or GitHub - copy from there]
```

#### src/components/ui/Textarea.tsx
```typescript
[See Textarea.tsx in the git repo or GitHub - copy from there]
```

#### src/components/ui/Card.tsx
```typescript
[See Card.tsx in the git repo or GitHub - copy from there]
```

#### src/components/ui/Modal.tsx
```typescript
[See Modal.tsx in the git repo or GitHub - copy from there]
```

### Layout Components

#### src/components/layout/Header.tsx
```typescript
[See Header.tsx in the git repo or GitHub - copy from there]
```

### Auth Pages

#### src/app/auth/login/page.tsx
```typescript
[See auth/login/page.tsx in the git repo or GitHub - copy from there]
```

#### src/app/auth/register/page.tsx
```typescript
[See auth/register/page.tsx in the git repo or GitHub - copy from there]
```

### Dashboard Pages

#### src/app/dashboard/page.tsx
```typescript
[See dashboard/page.tsx in the git repo or GitHub - copy from there]
```

#### src/app/dashboard/events/new/page.tsx
```typescript
[See dashboard/events/new/page.tsx in the git repo or GitHub - copy from there]
```

#### src/app/dashboard/events/[id]/preview/page.tsx
```typescript
[See dashboard/events/[id]/preview/page.tsx in the git repo or GitHub - copy from there]
```

#### src/app/dashboard/events/[id]/contacts/page.tsx
```typescript
[See dashboard/events/[id]/contacts/page.tsx in the git repo or GitHub - copy from there]
```

#### src/app/dashboard/events/[id]/schedule/page.tsx
```typescript
[See dashboard/events/[id]/schedule/page.tsx in the git repo or GitHub - copy from there]
```

### RSVP Pages

#### src/app/rsvp/[eventId]/page.tsx
```typescript
[See rsvp/[eventId]/page.tsx in the git repo or GitHub - copy from there]
```

### API Routes

#### src/app/api/events/[id]/route.ts
```typescript
[See api/events/[id]/route.ts in the git repo or GitHub - copy from there]
```

#### src/app/api/contacts/[id]/route.ts
```typescript
[See api/contacts/[id]/route.ts in the git repo or GitHub - copy from there]
```

#### src/app/api/contacts/rsvp/route.ts
```typescript
[See api/contacts/rsvp/route.ts in the git repo or GitHub - copy from there]
```

## Step 3: Run the App

```bash
npm install
npm run dev
```

## Step 4: Test

Visit: http://localhost:3000

- Register an account
- Create an event
- Preview the invitation
- Upload contacts
- Schedule sending

---

## Alternative: Download from GitHub

All the code is available on GitHub with proper Windows-compatible paths:

https://github.com/eyadaboelzalaf/event-invitations

You can browse and copy individual files directly from GitHub's web interface.
