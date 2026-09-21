import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Template from '@/models/Template';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const eventType = request.nextUrl.searchParams.get('eventType');
    const language = request.nextUrl.searchParams.get('language') || 'he';

    let query: any = { language };
    if (eventType) {
      query.eventType = eventType;
    }

    const templates = await Template.find(query).sort({ isDefault: -1 });

    return NextResponse.json(templates, { status: 200 });
  } catch (error: any) {
    console.error('Fetch templates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint for seed data - run once to populate default templates
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const defaultTemplates = [
      {
        name: 'Classic Wedding',
        eventType: 'wedding',
        language: 'en',
        isDefault: true,
        design: {
          colors: {
            primary: '#E6B8D7',
            secondary: '#9B4D7D',
            background: '#FFF8FC',
            text: '#333333',
          },
          fonts: {
            heading: 'Georgia',
            body: 'Arial',
          },
          layout: 'elegant',
        },
        content: '<div class="wedding-template"><h1>{{eventTitle}}</h1><p>Date: {{eventDate}}</p></div>',
      },
      {
        name: 'Fun Birthday',
        eventType: 'birthday',
        language: 'en',
        isDefault: true,
        design: {
          colors: {
            primary: '#FFD700',
            secondary: '#FFA500',
            background: '#FFF8DC',
            text: '#333333',
          },
          fonts: {
            heading: 'Comic Sans MS',
            body: 'Arial',
          },
          layout: 'playful',
        },
        content: '<div class="birthday-template"><h1>🎉 {{eventTitle}}</h1><p>Join us on {{eventDate}}</p></div>',
      },
    ];

    await Template.insertMany(defaultTemplates);

    return NextResponse.json(
      { message: 'Default templates created' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create templates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
