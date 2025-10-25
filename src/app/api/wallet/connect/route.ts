import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/db/client';
import { wallets, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

const WalletConnectSchema = z.object({
  address: z.string().min(8),
  pubkey: z.string().min(8).optional(),
  // signature: z.string().optional(), // TODO: verify signed payload
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, pubkey } = WalletConnectSchema.parse(body);
    const db = getDb();

    // Ensure a stable userId via cookie
    const jar = await cookies();
    let userId = jar.get('osd_uid')?.value || (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));

    // Create user if missing
    await db.insert(users).values({ id: userId }).onConflictDoNothing();

    // Upsert wallet and attach userId
    const existing = await db.select().from(wallets).where(eq(wallets.address, address));
    if (existing.length > 0) {
      if (!existing[0].userId) {
        await db.update(wallets).set({ userId }).where(eq(wallets.address, address));
      }
      const res = NextResponse.json({ ok: true, message: 'Wallet already connected' }, { status: 200 });
      // Set cookie on response if it didn't exist yet
      if (!jar.get('osd_uid')?.value) res.cookies.set('osd_uid', userId, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
      return res;
    }

    await db.insert(wallets).values({ address, pubkey, verified: false, userId });
    const res = NextResponse.json({ ok: true }, { status: 201 });
    if (!jar.get('osd_uid')?.value) res.cookies.set('osd_uid', userId, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  } catch (err: unknown) {
    const error = err as { issues?: unknown };
    if (error?.issues) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    console.error('wallet connect error', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
