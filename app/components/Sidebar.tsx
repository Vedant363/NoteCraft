"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Notebook, CheckSquare, Settings, ChevronLeft, ChevronRight, Menu, CalendarIcon, PencilRuler, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type SidebarProps = {}

export function Sidebar({}: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-xl md:text-2xl font-bold ${isCollapsed && !isMobile ? "hidden" : "block"}`}>
            NoteCraft
          </h1>
          {isCollapsed && !isMobile && <Notebook className="h-6 w-6" />}
        </div>
        <nav className="space-y-2">
          <Button
            variant={pathname === "/notes" ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed && !isMobile ? "px-2" : ""} text-sm md:text-base`}
            asChild
          >
            <Link href="/notes">
              <Notebook className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2">Notes</span>}
            </Link>
          </Button>
          <Button
            variant={pathname === "/tasks" ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed && !isMobile ? "px-2" : ""} text-sm md:text-base`}
            asChild
          >
            <Link href="/tasks">
              <CheckSquare className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2">Tasks</span>}
            </Link>
          </Button>
          <Button
            variant={pathname === "/calendar" ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed && !isMobile ? "px-2" : ""} text-sm md:text-base`}
            asChild
          >
            <Link href="/calendar">
              <CalendarIcon className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2">Calendar</span>}
            </Link>
          </Button>
          <Button
            variant={pathname === "/draw" ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed && !isMobile ? "px-2" : ""} text-sm md:text-base`}
            asChild
          >
            <Link href="/draw">
              <PencilRuler className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2">Draw</span>}
            </Link>
          </Button>
          <Button
            variant={pathname === "/trash" ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed && !isMobile ? "px-2" : ""} text-sm md:text-base`}
            asChild
          >
            <Link href="/trash">
              <Trash2 className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2">Trash</span>}
            </Link>
          </Button>
          <Button
            variant={pathname === "/settings" ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed && !isMobile ? "px-2" : ""} text-sm md:text-base`}
            asChild
          >
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2">Settings</span>}
            </Link>
          </Button>
        </nav>
      </div>
      {!isMobile && (
        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="w-full py-2 px-4 text-left flex items-center justify-between"
          >
            {isCollapsed ? (
              <>
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Expand sidebar</span>
              </>
            ) : (
              <>
                <span>Collapse sidebar</span>
                <ChevronLeft className="h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[200px]">
          <SidebarContent isMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex bg-secondary flex-col justify-between transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  )
}

