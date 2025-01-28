"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"
import type { Task } from "../types"

interface NotificationDropdownProps {
  tasks: Task[]
  children: React.ReactNode
}

export function NotificationDropdown({ tasks, children }: NotificationDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Tasks Deadline</h4>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id}>
                  <Link href={`/tasks/${task.id}`} passHref>
                    <Button variant="ghost" className="w-full justify-start">
                      <span className="truncate">{task.title}</span>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {format(new Date(task.due_date!), "MMM d")}
                      </span>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming tasks</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

