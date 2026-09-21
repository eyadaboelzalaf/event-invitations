import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().min(9),
  language: z.enum(['he', 'en', 'ar']).default('he'),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User(data);
    await user.save();

    // Don't return password
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
