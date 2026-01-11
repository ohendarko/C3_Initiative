"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, RefreshCw, ArrowRight, CheckCircle, Clock, Ghost } from "lucide-react"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import { toast } from "@/hooks/use-toast"

function PendingVerificationContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60) // 24 hours in seconds

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email address not found. Please sign up or log in.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Email sent! 📧",
          description: "Check your inbox for a new verification email.",
        })
        setTimeRemaining(24 * 60 * 60) // Reset timer
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to resend email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30">
      <div className="container mx-auto max-w-md">
        <Card className="shadow-2xl border-2 border-blue-500">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We sent a verification link to{" "}
              <strong className="text-blue-600 block mt-1">{email || "your email"}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                How to Verify
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
                <li>Open the email we sent to your inbox</li>
                <li>Click the "Verify Email Address" button</li>
                <li>You'll be redirected to the login page</li>
                <li>Log in and start learning!</li>
              </ol>
            </div>

            {/* Timer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Verification link expires in
              </p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">
                {formatTime(timeRemaining)}
              </p>
            </div>

            {/* Troubleshooting */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Didn't receive the email?
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Check your <strong>spam/junk</strong> folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Make sure <strong>{email}</strong> is correct</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Wait a few minutes for the email to arrive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Add <strong>noreply@c3-learning.com</strong> to your contacts</span>
                </li>
              </ul>

              <Button
                onClick={handleResendVerification}
                variant="outline"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t">
              <Link href="/learn">
                <Button className="w-full gradient-orange-blue text-white hover-shadow-gradient group">
                  Already Verified? Log In
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/signup">
                <Button variant="ghost" className="w-full">
                  Used wrong email? Sign up again
                </Button>
              </Link>
              <div className="text-sm flex flex-col justify-center items-center">
                <p>Still having issues?</p>
                <Link href="mailto:support@c3-learning.com">
                  <Button variant="outline" className="w-full border-blue-950">
                    Contact <strong>support@c3-learning.com</strong>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PendingVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    }>
      <PendingVerificationContent />
    </Suspense>
  )
}