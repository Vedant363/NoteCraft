"use client"

import { Calendar } from "../components/Calendar"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { useTasks } from "../hooks/useTasks"

export default function CalendarPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { tasks, fetchTasks } = useTasks()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user, fetchTasks])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <Calendar tasks={tasks} />
    </div>
  )
}

