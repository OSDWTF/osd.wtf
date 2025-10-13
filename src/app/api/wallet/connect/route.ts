import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/db/client';
import { wallets } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    const existing = await db.select().from(wallets).where(eq(wallets.address, address));
    if (existing.length > 0) {
      return NextResponse.json({ ok: true, message: 'Wallet already connected' }, { status: 200 });
    }

    await db.insert(wallets).values({ address, pubkey, verified: false });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    if (err?.issues) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }
    console.error('wallet connect error', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
