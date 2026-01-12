import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import Head from "next/head"
import Footer from "@/components/footer"
import SessionWrapper from "@/providers/SessionWrapper"
import Header from "@/components/header"
import { Poppins } from "next/font/google"
import { UserProvider } from "@/context/UserContext"
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose weights you need
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://c3-learning.com'),
  title: {
    default: 'C3 Initiative - Cervical Cancer Education',
    template: '%s | C3 Initiative',
  },
  description: 'Free online cervical cancer education platform. Learn about prevention, screening, HPV, and treatment through interactive modules.',
  keywords: ['cervical cancer', 'HPV', 'cancer prevention', 'health education', 'medical learning'],
  authors: [{ name: 'C3 Initiative' }],
  creator: 'C3 Initiative',
  publisher: 'C3 Initiative',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://c3-learning.com',
    title: 'C3 Initiative - Cervical Cancer Education',
    description: 'Free online cervical cancer education platform',
    siteName: 'C3 Initiative',
    images: [
      {
        url: '/images/og-image.png', // Create this
        width: 1200,
        height: 630,
        alt: 'C3 Initiative',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C3 Initiative - Cervical Cancer Education',
    description: 'Free online cervical cancer education platform',
    images: ['/images/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'zGMyfhH9SW9Q0rGib_uc7PpwuyuXaN6ZDu607DqwVyE',
  },
}

// export const metadata: Metadata = {
//   title: "C3 Initiative - Smart Cervical Cancer Education",
//   description: "C3 Initiative's e-learning platform for cervical cancer education and awareness",
//   verification: {
//     google: "zGMyfhH9SW9Q0rGib_uc7PpwuyuXaN6ZDu607DqwVyE",
//   },
  
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <Head>
        <meta name="google-site-verification" content="zGMyfhH9SW9Q0rGib_uc7PpwuyuXaN6ZDu607DqwVyE" />
      </Head> */}
      <body className={`${inter.className} ${poppins.variable}`}>
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <UserProvider>
              <Header />
              <ThemeToggle />
              <main>
                {children}
                <Toaster />
                <Analytics />
              </main>
              <Footer />
            </UserProvider>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
