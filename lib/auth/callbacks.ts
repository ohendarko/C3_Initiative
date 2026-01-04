import { PrismaClient } from "@/lib/generated/prisma"
import { AuthOptions, Session, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"

const prisma = new PrismaClient()

export const authCallbacks: AuthOptions["callbacks"] = {
  async signIn({ user }: { user: AdapterUser | User }) {
    if (!user.email) return false
    

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name ?? "",
          firstName: (user as any).firstName ?? "", // 👈 if custom fields aren't typed
          lastName: (user as any).lastName ?? "",
          password: "", // 👈 required in your schema
        },
      })
    }

    return true
  },

  async session({ session }: { session: Session }) {
    if (session.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      if (dbUser) {
        session.user.id = dbUser.id
      }
    }
    return session
  },
}
