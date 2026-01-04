"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Spinner from "@/components/Spinner"
import { signIn, useSession } from "next-auth/react"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Only redirect if not coming from logout
      const isLoggingOut = localStorage.getItem("isLoggingOut");
      if (!isLoggingOut) {
        setIsLoading(true);
        setLoading(true);
        router.push('/learn/cervical-cancer');
      } else {
        localStorage.removeItem("isLoggingOut");
      }
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      toast({
        title: 'Login failed. Wrong username / password!',
        description: "Please check your credentials and try again.",
        variant: 'destructive',
      });
      setIsLoading(false);
      console.log(res.error)
      // alert('Check your credentials and try again')
    } else {
      if(status === 'unauthenticated') {
        setIsLoading(false);
        router.push("/learn");
      }
      toast({
        title: 'Login successful',
        description: 'Welcome back to C3 Inititative',
        variant: 'success',
        duration: 2000,
      });
      localStorage.setItem("isLoggingOut", "false")
      setIsLoading(true);
      router.push("/learn/cervical-cancer");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30">

      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-orange-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">
            Welcome Back to the{" "}
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              C3 Initiative
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Continue your cervical cancer education journey</p>
        </div>

        <Card className="shadow-2xl hover-shadow-gradient">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your learning dashboard</CardDescription>
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
                  value={formData.email}
                  disabled={isLoading || isLoading}
                  onChange={handleInputChange}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading || isLoading}
                    className="focus:ring-orange-500 focus:border-orange-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full gradient-orange-blue text-white hover-shadow-gradient group" disabled={isLoading || isLoading}>
                {isLoading && <Spinner />}
                Sign In
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button
                onClick={async () => {

                  setLoading(true);
                  try {
                    await signIn("google", { callbackUrl: "/learn/cervical-cancer" });
                    // You won't usually hit here because signIn will redirect
                  } catch (err) {
                    console.error("Sign in failed", err);
                    setLoading(false);
                  }
                }}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                // disabled={loading || isLoading}
                disabled
              >
                {loading && <Spinner />}
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>

                </span>
                Continue with Google
              </Button>
              
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link href="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
