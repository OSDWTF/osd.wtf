import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/db/client';
import { emails } from '@/db/schema';
import { eq } from 'drizzle-orm';

const EmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email } = EmailSchema.parse(json);
    const db = getDb();

    // Check if exists
    const existing = await db.select().from(emails).where(eq(emails.email, email));
    if (existing.length > 0) {
      return NextResponse.json({ ok: true, message: 'Already subscribed' }, { status: 200 });
    }

    await db.insert(emails).values({ email });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    const error = err as { issues?: unknown };
    if (error?.issues) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }
    console.error('email signup error', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
