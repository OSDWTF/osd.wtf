import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

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
});

export { handler as GET, handler as POST };
