import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { getDb } from "../../../../db/client";
import { profiles, users, counters } from "../../../../db/schema";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";

type TwitterRawProfile = {
  data?: {
    id?: string;
    username?: string;
    name?: string;
    profile_image_url?: string;
  };
  id?: string;
  username?: string;
  name?: string;
  picture?: string;
};

function parseTwitterProfile(profile: unknown): {
  id?: string;
  username?: string;
  name?: string;
  picture?: string;
} {
  const p = profile as TwitterRawProfile | undefined;
  return {
    id: p?.data?.id ?? p?.id,
    username: p?.data?.username ?? p?.username,
    name: p?.data?.name ?? p?.name,
    picture: p?.data?.profile_image_url ?? p?.picture,
  };
}

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      authorization: { url: "https://x.com/i/oauth2/authorize" },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "twitter") {
          const db = getDb();
          const { id: rawId, username, name: profName, picture } = parseTwitterProfile(profile);
          const xUserId = account.providerAccountId ?? rawId ?? undefined;
          const handle = username;
          const name = user?.name ?? profName ?? undefined;
          const image = user?.image ?? picture ?? undefined;
          const jar = await cookies();
          const userId = jar.get('osd_uid')?.value || (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));

          await db.insert(users).values({ id: userId }).onConflictDoNothing();

          if (xUserId) {
            const existing = await db.select().from(profiles).where(eq(profiles.xUserId, xUserId)).limit(1);
            if (!existing.length) {
              await db.insert(profiles).values({ xUserId, handle, name, image, userId });
            } else if (!existing[0].userId) {
              await db.update(profiles).set({ userId, handle, name, image }).where(eq(profiles.xUserId, xUserId));
            }
          }

          const u = await db.select({ osdNo: users.osdNo }).from(users).where(eq(users.id, userId)).limit(1);
          if (u.length && (u[0].osdNo == null)) {
            await db.insert(counters).values({ key: 'osd_no', value: 0 }).onConflictDoNothing();
            const updated = await db
              .update(counters)
              .set({ value: sql`${counters.value} + 1` })
              .where(eq(counters.key, 'osd_no'))
              .returning({ value: counters.value });
            const nextNo = updated[0]?.value;
            if (nextNo) {
              await db.update(users).set({ osdNo: nextNo }).where(eq(users.id, userId));
            }
          }
        }
      } catch {}
      return true;
    },
    async redirect({ url, baseUrl }) {
      try {
        const u = new URL(url, baseUrl);
        if (u.pathname.startsWith("/api/auth/signin") || u.searchParams.has("error")) {
          return baseUrl;
        }
        if (u.origin === baseUrl) return u.href;
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        return baseUrl;
      } catch {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        return baseUrl;
      }
    },
  },
});

export { handler as GET, handler as POST };
