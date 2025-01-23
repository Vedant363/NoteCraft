"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { Search } from "../components/Search"
import { TaskList } from "../components/TaskList"

export default function Tasks() {
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
    <div className="flex flex-col h-full">
      <Search />
      <TaskList />
    </div>
  )
}

