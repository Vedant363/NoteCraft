"use client"

import { ThemeProvider } from "./components/ThemeProvider"
import { Sidebar } from "./components/Sidebar"
import { usePathname } from "next/navigation"
import { useTasks } from "./hooks/useTasks"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = pathname !== "/"
  const { getUpcomingTasks } = useTasks()
  const upcomingTasks = getUpcomingTasks()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex h-screen">
        {showSidebar && <Sidebar upcomingTasks={upcomingTasks} />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </ThemeProvider>
  )
}

