import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import SessionWrapper from "@/providers/SessionWrapper"

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ThemeToggle />
          {children}
        </ThemeProvider>
    </SessionWrapper>
  )
}
