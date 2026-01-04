import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { prisma } from "@/lib//prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
	// adapter: PrismaAdapter(prisma),
  providers: [Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
		// authorization: {
    //   params: {
    //     scope: "openid email profile",
    //     // Do NOT add prompt: "consent" unless you want forced consent every time
    //   }
    // }
  })],
  callbacks: {
  async session({ session }) {
    if (session.user?.email) {
      try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        })

        const data = await res.json()
        if (data?.id) {
          session.user.id = data.id
        }
      } catch (err) {
        console.error("Failed to fetch user in session callback", err)
      }
    }
    return session
  },
},
  secret: process.env.NEXTAUTH_SECRET,
})
