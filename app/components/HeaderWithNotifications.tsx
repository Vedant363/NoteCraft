"use client"

import { useAuth } from "../hooks/useAuth"
import { useTasks } from "../hooks/useTasks"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { NotificationDropdown } from "./NotificationDropdown"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function HeaderWithNotifications() {
  const { signOut, user } = useAuth()
  const router = useRouter()
  const { getUpcomingTasks } = useTasks()
  const upcomingTasks = getUpcomingTasks()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
      <div className="flex items-center space-x-4">
        <span>{user?.email}</span>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationDropdown tasks={upcomingTasks}>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4 text-blue-500" />
            {upcomingTasks.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {upcomingTasks.length}
              </Badge>
            )}
          </Button>
        </NotificationDropdown>
        <Button onClick={handleSignOut} variant="secondary">
          Sign Out
        </Button>
      </div>
    </header>
  )
}

