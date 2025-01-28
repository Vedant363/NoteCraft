"use client"

import { useAuth } from "../hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function UserProfile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Button variant="ghost" asChild className="hover:bg-gray-200">
      <Link href="/user" className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url || "/avatars/avatar1.png"} />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span>{user.user_metadata?.full_name || user.email}</span>
      </Link>
    </Button>
  )
}

