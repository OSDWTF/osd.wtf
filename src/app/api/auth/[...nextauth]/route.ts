import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { getDb } from "../../../../db/client";
import { profiles } from "../../../../db/schema";
import { eq } from "drizzle-orm";

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
