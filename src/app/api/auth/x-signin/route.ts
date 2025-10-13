import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect directly to the Twitter OAuth provider
  const callbackUrl = encodeURIComponent(process.env.NEXTAUTH_URL || 'http://localhost:3000');
  const redirectUrl = `/api/auth/signin/twitter?callbackUrl=${callbackUrl}`;
  
  return NextResponse.redirect(new URL(redirectUrl, process.env.NEXTAUTH_URL || 'http://localhost:3000'));
}
