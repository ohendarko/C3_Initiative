"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { Menu, X, BookOpen, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useUser } from "@/context/UserContext"
import UserAvatar from "@/components/UserAvatar"
import { clearUserCache } from "@/lib/clearCache"
import { toast } from "@/hooks/use-toast"

export default function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { data: session, status } = useSession()
  const { isAdmin, userName } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = status === "authenticated"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    if (!session?.user?.email) return
    
    try {
      clearUserCache(session.user.email)
      localStorage.setItem("isLoggingOut", "true")
      
      await signOut({ redirect: false })
      
      toast({
        title: "Logged out",
        description: "You have been signed out successfully.",
      })
      
      window.location.href = "/learn"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
    isScrolled
      ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
      : "bg-white/30"
  }`

  const textClass = isScrolled
    ? "text-gray-700 dark:text-gray-300"
    : "text-gray-800 dark:text-white"

  const iconClass = isScrolled 
    ? "text-gray-800 dark:text-white" 
    : "text-gray-900 dark:text-white"

  return (
    <header className={`${headerClasses} ${isMenuOpen ? 'glass-effect' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" title="C3 Initiative">
            <div className="w-8 h-8 gradient-orange-blue rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className={`${textClass} text-xl font-bold`}>
              C3 Initiative
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`${textClass} hover:text-orange-500 transition-colors`}>
              Home
            </Link>
            <Link href="/#features" className={`${textClass} hover:text-orange-500 transition-colors`}>
              About
            </Link>
            {isLoggedIn && (
              <Link
                href="/learn/cervical-cancer"
                className={`${textClass} hover:text-orange-500 transition-colors`}
              >
                Modules
              </Link>
            )}
            {isLoggedIn && isAdmin && (
              <Link
                href="/instructor"
                className={`${textClass} hover:text-orange-500 transition-colors`}
              >
                Instructor
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {!isLoggedIn ? (
              <>
                <Link href="/learn">
                  <Button variant="ghost" className={`${textClass} hover:text-orange-500 transition-colors`}>
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="gradient-orange-blue text-white hover-shadow-gradient">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <UserAvatar 
                    name={session?.user?.name} 
                    email={session?.user?.email}
                    size="md"
                  />
                  <span className={`${textClass} font-medium hidden lg:inline`}>
                    {userName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session?.user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    {/* <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link> */}

                    {/* <Link 
                      href="/settings" 
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link> */}

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden bg-orange-300/50 p-2 rounded-sm flex-shrink-0" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${iconClass}`} />
            ) : (
              <Menu className={`w-6 h-6 ${iconClass}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`${textClass} hover:text-orange-500 transition-colors bg-orange-300/50 p-2 rounded-sm`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/#features" 
                className={`${textClass} hover:text-orange-500 transition-colors bg-orange-300/50 p-2 rounded-sm`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {isLoggedIn && (
                <Link
                  href="/learn/cervical-cancer"
                  className={`${textClass} hover:text-orange-500 transition-colors bg-orange-300/50 p-2 rounded-sm`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Modules
                </Link>
              )}
              {isLoggedIn && isAdmin && (
                <Link
                  href="/instructor"
                  className={`${textClass} hover:text-orange-500 transition-colors bg-orange-300/50 p-2 rounded-sm`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instructor
                </Link>
              )}

              {/* Mobile User Section */}
              {isLoggedIn && (
                <>
                  <div className={`${textClass} flex items-center gap-2 bg-orange-300/50 p-3 rounded-sm`}>
                    <UserAvatar 
                      name={session?.user?.name} 
                      email={session?.user?.email}
                      size="md"
                    />
                    <div>
                      <p className="font-medium">{userName}</p>
                      <p className="text-xs opacity-70">{session?.user?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </>
              )}

              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 pt-4">
                  <Link href="/learn">
                    <Button variant="ghost" className="w-full justify-start bg-orange-300/50 p-2 rounded-sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full gradient-orange-blue text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}