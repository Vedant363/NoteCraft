"use client"

import { useAuth } from "../hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-end items-center p-4 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-4">
          <span>{user.email}</span>
          <Button onClick={handleSignOut} variant="secondary">
            Sign Out
          </Button>
        </div>
      </header>
      {children}
    </div>
  )
}

