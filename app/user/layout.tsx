"use client"

import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { HeaderWithNotifications } from "../components/HeaderWithNotifications"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-screen">
      <HeaderWithNotifications />
      {children}
    </div>
  )
}

