import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { ThemeToggle } from "@/components/theme-toggle"
import SessionWrapper from "@/providers/SessionWrapper"
import { LearnerProvider } from "@/context/LearnerContext"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "C3 Initiative - Smart Cervical Cancer Education",
  description: "C3 Initiative's premium e-learning platform for cervical cancer education and awareness",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionWrapper>
      <LearnerProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </LearnerProvider>
    </SessionWrapper>
  )
}
