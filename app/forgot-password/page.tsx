// app/forgot-password/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        toast({
          title: "Email sent!",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send reset email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Reset Link Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Don't see the email? Check your spam folder.
              </p>
              <Link href="/learn">
                <Button className="gradient-orange-blue text-white hover-shadow-gradient">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30">
      <div className="container mx-auto max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="w-16 h-16 gradient-orange-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-center">Forgot Password?</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-orange-blue text-white hover-shadow-gradient group"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                Send Reset Link
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Remember your password?{" "}
                <Link href="/learn" className="text-orange-500 hover:text-orange-600 font-medium">
                  Back to Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}