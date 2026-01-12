import { NextAuthOptions, DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "../email";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      // firstname?: string | null;
      // lastName?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }
}


async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

async function verifyPassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('[Auth] Login attempt for:', credentials?.email)
        if (!credentials?.email || !credentials?.password) return null;

        const user = await findUserByEmail(credentials.email);
        if (!user) return null;
        if(!user.password) return null;

        // if (!user.emailVerified) {
        //   throw new Error("Please verify your email before logging in")
        // }

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          firstName: user.firstName,
          lastNmae: user.lastName,
          name: user.name,
          email: user.email,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
       authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? "",
            firstName: user.name?.split(" ")[0] ?? "",
            lastName: user.name?.split(" ")[1] ?? "",
            emailVerified: true,  // ✅ Verified by Google
            resetToken: `${user?.name + user.email}`
          },
        });
        // ✅ Send welcome email for new OAuth users
        try {
          console.log('[Auth] Sending welcome email...')
          await sendWelcomeEmail(user.email, user.name ?? "")
          console.log('[Auth] ✅ Welcome email sent')
        } catch (error) {
          console.error('[Auth] ❌ Failed to send welcome email:', error)
          // Don't block sign in if email fails
        }
      } else {
        console.log('[Auth] Existing user signing in:', existingUser.id)
        // ✅ No welcome email for existing users
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // On sign in, add user data to token
      if (user) {
        token.id = user.id
        token.name = user.name      // ✅ Add name to token
        token.email = user.email    // ✅ Add email to token
      }

      // For OAuth
      // if (account) {
      //   token.accessToken = account.access_token
      //   token.refreshToken = account.refresh_token
      //   token.expiresAt = account.expires_at
      // }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string 
        session.user.email = token.email as string  
        // session.user.accessToken = token.accessToken as string
        // session.user.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
};