import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { findUserByEmail, findOrCreateGoogleUser } from "@/lib/auth/db";
import { sendSignInEmail, sendWelcomeEmail } from "@/lib/auth/mailer";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined, image: user.image ?? undefined };
      },
    }),
    // Only registered when real credentials are configured - the Google button is hidden
    // in the UI until then, so there is no broken sign-in option in the meantime.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
  ],
  events: {
    // Fires after every successful sign-in (password or Google). Not awaited: a slow or failing
    // mail server must never delay or break signing in.
    async signIn({ user, account }) {
      if (!user?.email) return;
      void sendSignInEmail(user.email, user.name, account?.provider === "google" ? "google" : "password");
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const { user: dbUser, created } = await findOrCreateGoogleUser({
          googleId: account.providerAccountId,
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        });
        // Re-key the user object to our own DB id, used below in the jwt callback.
        user.id = dbUser.id;
        // First ever Google sign-in = new account: welcome email (not awaited, never blocks sign-in).
        if (created) void sendWelcomeEmail(dbUser.email, dbUser.name);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
});
