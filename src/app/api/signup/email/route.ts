import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/db/client';
import { emails, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

const EmailSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email } = EmailSchema.parse(json);
    const db = getDb();

    // Ensure a stable userId via cookie
    const jar = cookies();
    let userId = jar.get('osd_uid')?.value;
    let setCookie = false;
    if (!userId) {
      userId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
      setCookie = true;
    }

    // Create user if missing
    await db.insert(users).values({ id: userId }).onConflictDoNothing();

    // Upsert email and attach userId
    const existing = await db.select().from(emails).where(eq(emails.email, email));
    if (existing.length > 0) {
      if (!existing[0].userId) {
        await db
          .update(emails)
          .set({ userId })
          .where(eq(emails.email, email));
      }
      const res = NextResponse.json({ ok: true, message: 'Already subscribed' }, { status: 200 });
      if (setCookie) res.cookies.set('osd_uid', userId, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
      return res;
    }

    await db.insert(emails).values({ email, userId });
    const res = NextResponse.json({ ok: true }, { status: 201 });
    if (setCookie) res.cookies.set('osd_uid', userId, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  } catch (err: unknown) {
    const error = err as { issues?: unknown };
    if (error?.issues) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
    }
    console.error('email signup error', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
