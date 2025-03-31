import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // hd: process.env.GOOGLE_WORKSPACE_DOMAIN, // Limit to specific domain
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Only allow sign-in with company email domain
      if (account?.provider === "google") {
        return true;
        // return (
        //   profile?.email?.endsWith(`@${process.env.GOOGLE_WORKSPACE_DOMAIN}`) ??
        //   false
        // );
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
};
