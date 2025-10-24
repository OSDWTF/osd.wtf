import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { getDb } from "../../../../db/client";
import { profiles } from "../../../../db/schema";
import { eq } from "drizzle-orm";

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
          const xUserId = account.providerAccountId || (profile as any)?.data?.id || (profile as any)?.id;
          const handle = (profile as any)?.data?.username || (profile as any)?.username || undefined;
          const name = user?.name || (profile as any)?.data?.name || (profile as any)?.name || undefined;
          const image = user?.image || (profile as any)?.data?.profile_image_url || (profile as any)?.picture || undefined;
          if (xUserId) {
            const existing = await db.select().from(profiles).where(eq(profiles.xUserId, xUserId)).limit(1);
            if (!existing.length) {
              await db.insert(profiles).values({ xUserId, handle, name, image });
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
