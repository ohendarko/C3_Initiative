// components/UserAvatar.tsx
"use client"

interface UserAvatarProps {
  name?: string | null
  email?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function UserAvatar({ 
  name, 
  email, 
  size = "md",
  className = "" 
}: UserAvatarProps) {
  // Get initials from name or email
  const getInitials = () => {
    if (name) {
      const parts = name.trim().split(" ")
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return name.slice(0, 2).toUpperCase()
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  // Generate consistent color based on name/email
  const getColor = () => {
    const str = name || email || "user"
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      "bg-gradient-to-br from-orange-500 to-pink-500",
      "bg-gradient-to-br from-blue-500 to-cyan-500",
      "bg-gradient-to-br from-purple-500 to-pink-500",
      "bg-gradient-to-br from-green-500 to-emerald-500",
      "bg-gradient-to-br from-yellow-500 to-orange-500",
      "bg-gradient-to-br from-indigo-500 to-purple-500",
      "bg-gradient-to-br from-red-500 to-pink-500",
      "bg-gradient-to-br from-teal-500 to-cyan-500",
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${getColor()} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        shadow-md
        ring-2
        ring-white
        dark:ring-gray-800
        ${className}
      `}
      title={name || email || "User"}
    >
      {getInitials()}
    </div>
  )
}