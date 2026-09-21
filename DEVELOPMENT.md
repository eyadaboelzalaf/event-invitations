# Development Guide - Event Invitations App

## Code Structure & Conventions

### Directory Organization

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── logout/route.ts
│   │   ├── events/
│   │   │   ├── route.ts (GET all, POST new)
│   │   │   ├── [id]/route.ts (GET, PUT, DELETE)
│   │   │   └── [id]/status/route.ts (PUT status)
│   │   ├── templates/route.ts
│   │   ├── contacts/route.ts
│   │   └── whatsapp/
│   │       ├── send/route.ts
│   │       ├── webhook/route.ts
│   │       └── status/route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── events/page.tsx
│   │   ├── events/new/page.tsx
│   │   ├── events/[id]/page.tsx
│   │   ├── events/[id]/preview/page.tsx
│   │   ├── templates/page.tsx
│   │   └── layout.tsx
│   ├── [locale]/
│   │   └── page.tsx
│   ├── page.tsx (Home)
│   └── layout.tsx (Root)
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── EventForm.tsx
│   │   └── ContactsForm.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventList.tsx
│   │   ├── EventPreview.tsx
│   │   └── TemplateSelector.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Loader.tsx
│   └── common/
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── db.ts (MongoDB connection)
│   ├── auth.ts (Auth utilities)
│   ├── whatsapp.ts (WhatsApp helpers)
│   ├── validators.ts (Zod schemas)
│   └── utils.ts (General utilities)
├── models/
│   ├── User.ts
│   ├── Event.ts
│   ├── Template.ts
│   └── Contact.ts
├── store/
│   └── store.ts (Zustand store)
├── messages/
│   ├── he.json
│   ├── en.json
│   └── ar.json
├── styles/
│   ├── globals.css
│   ├── components.css
│   └── animations.css
└── i18n.ts
```

## Coding Standards

### TypeScript
```typescript
// Always use proper types
interface EventProps {
  id: string;
  title: string;
  onEvent?: (event: React.MouseEvent) => void;
}

export const EventCard: React.FC<EventProps> = ({ id, title, onEvent }) => {
  return <div onClick={onEvent}>{title}</div>;
};
```

### React Components
```typescript
// Functional components with TypeScript
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<StateType>(initial);
  
  const handleEvent = useCallback(() => {
    // Logic here
  }, [dependencies]);
  
  return <div>{/* JSX */}</div>;
};

MyComponent.displayName = 'MyComponent';
```

### Naming Conventions
- Components: `PascalCase` (e.g., `EventCard.tsx`)
- Functions: `camelCase` (e.g., `handleSubmit()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT`)
- Interfaces: `IPrefixedPascalCase` (e.g., `IEvent`)

## API Route Development

### Request Handler Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  // Define your schema
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = requestSchema.parse(body);
    
    // Process data
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Authentication in Routes
```typescript
export async function GET(request: NextRequest) {
  try {
    // Get user from header (implement proper auth later)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Proceed with authenticated request
  } catch (error) {
    // Error handling
  }
}
```

## Database Operations

### Creating Documents
```typescript
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

export async function POST(request: NextRequest) {
  await dbConnect();
  
  const event = new Event(data);
  await event.save();
  await event.populate('templateId'); // Populate references
  
  return NextResponse.json(event);
}
```

### Querying Documents
```typescript
// Single document
const event = await Event.findById(id);
const user = await User.findOne({ email });

// Multiple documents
const events = await Event.find({ userId })
  .populate('templateId')
  .sort({ createdAt: -1 })
  .limit(10);

// With filtering
const templates = await Template.find({
  eventType: 'wedding',
  language: 'he'
});
```

### Updating Documents
```typescript
// Update one
await Event.findByIdAndUpdate(id, { status: 'sent' });

// Update many
await Contact.updateMany(
  { eventId: id, status: 'pending' },
  { status: 'sent' }
);
```

### Deleting Documents
```typescript
// Delete one
await Event.findByIdAndDelete(id);

// Delete many
await Contact.deleteMany({ eventId: id });
```

## Form Handling with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['wedding', 'birthday', 'engagement']),
  eventDate: z.string().datetime(),
});

type FormData = z.infer<typeof schema>;

export const EventForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    const result = await response.json();
    // Handle success
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

## State Management with Zustand

### Using the Store
```typescript
'use client';

import { useAppStore } from '@/store/store';

export const MyComponent: React.FC = () => {
  const { user, currentEvent, setCurrentEvent, isLoading } = useAppStore();

  const handleEventSelect = (event) => {
    setCurrentEvent(event);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      {user.name}
      {/* Render event details */}
    </div>
  );
};
```

## Internationalization (i18n)

### Using Translations
```typescript
'use client';

import { useTranslations } from 'next-intl';

export const Component: React.FC = () => {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### Adding New Translations
1. Add keys to all three files:
   - `src/messages/he.json`
   - `src/messages/en.json`
   - `src/messages/ar.json`

```json
{
  "newSection": {
    "newKey": "Translation text"
  }
}
```

## Testing

### Unit Tests (Jest + React Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click</Button>);
    
    getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### API Route Tests
```typescript
import { POST } from '@/app/api/events/route';
import { NextRequest } from 'next/server';

jest.mock('@/lib/db');

describe('POST /api/events', () => {
  it('should create a new event', async () => {
    const request = new NextRequest('http://localhost:3000/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Event',
        type: 'wedding',
        // ... other fields
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

## Debugging

### VS Code Debugger
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Console Logging
```typescript
console.log('Debug:', variable);
console.error('Error:', error);
console.table(arrayOfObjects);
```

### React DevTools
- Install React DevTools extension
- Inspect component props and state
- Time component renders

## Performance Optimization

### Code Splitting
```typescript
// Dynamic import for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/Heavy'),
  { loading: () => <div>Loading...</div> }
);
```

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

export const Component = memo(({ data }) => {
  const processed = useMemo(() => expensiveOperation(data), [data]);
  
  const handleClick = useCallback(() => {
    // Handler
  }, []);

  return <div>{processed}</div>;
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority
/>
```

## Common Issues & Solutions

### Hot Reload Not Working
```bash
# Restart dev server
npm run dev

# Clear .next cache
rm -rf .next
npm run dev
```

### Module Not Found
```bash
# Check import paths
# Verify file exists and extension is correct
# Check tsconfig.json paths

# Restart TypeScript server in VS Code
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Database Connection Issues
```bash
# Verify MongoDB is running
# Check .env.local variables
# Try direct connection with mongo CLI

mongo "mongodb://localhost:27017/event-invitations"
```

### CORS Issues
- Configure Next.js CORS headers
- Or use relative paths for API calls

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/event-creation

# Make changes
git add .
git commit -m "feat: add event creation form"

# Push to remote
git push origin feature/event-creation

# Create Pull Request
# Review and merge
```

## Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes (no logic)
refactor: code refactoring
perf: performance improvements
test: add or update tests
chore: build, dependencies, etc
```

---

Happy coding! 🚀
