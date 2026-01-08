// app/verify-email/page.tsx
"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading")
  const [message, setMessage] = useState("")
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (res.ok) {
          setStatus("success")
          setMessage(data.message)
          toast({
            title: "Verified Successfully",
            description: "You will receive a comfirmation email.",
            variant: "success"
          })
        } else {
          if (data.error?.includes("expired")) {
            setStatus("expired")
          } else {
            setStatus("error")
          }
          setMessage(data.error || "Verification failed")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred during verification")
      }
    }

    verifyEmail()
  }, [token])

  // Countdown for redirect
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push("/learn")
            return 0
          }
          return prev - 1
        })
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [status, router])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30">
      <div className="container mx-auto max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === "loading" && (
              <div className="py-8">
                <Loader2 className="w-16 h-16 mx-auto animate-spin text-orange-500" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  Verifying your email...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="py-8">
                <CheckCircle className="w-20 h-20 mx-auto text-green-600" />
                <h3 className="mt-4 text-2xl font-bold text-green-600">
                  Success! 🎉
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {message}
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Redirecting to login in {countdown} seconds...
                </p>
                <Link href="/learn">
                  <Button className="mt-6 gradient-orange-blue text-white hover-shadow-gradient">
                    Go to Login Now
                  </Button>
                </Link>
              </div>
            )}

            {status === "expired" && (
              <div className="py-8">
                <XCircle className="w-20 h-20 mx-auto text-yellow-600" />
                <h3 className="mt-4 text-2xl font-bold text-yellow-600">
                  Token Expired
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {message}
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Don't worry! You can request a new verification email.
                </p>
                <Link href="/resend-verification">
                  <Button className="mt-6 gradient-orange-blue text-white hover-shadow-gradient">
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="py-8">
                <XCircle className="w-20 h-20 mx-auto text-red-600" />
                <h3 className="mt-4 text-2xl font-bold text-red-600">
                  Verification Failed
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {message}
                </p>
                <div className="flex flex-col gap-3 mt-6">
                  <Link href="/resend-verification">
                    <Button className="w-full gradient-orange-blue text-white hover-shadow-gradient">
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </Button>
                  </Link>
                  <Link href="/learn">
                    <Button variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}