"use client"

import { useState, useEffect } from "react"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import type { Task } from "../types"

const localizer = momentLocalizer(moment)

interface CalendarProps {
  tasks: Task[]
}

export function Calendar({ tasks }: CalendarProps) {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const taskEvents = tasks
      .filter((task) => !task.completed && task.due_date) // Filter out completed tasks and those without due dates
      .map((task) => ({
        title: task.title,
        start: new Date(task.due_date!),
        end: new Date(task.due_date!),
        allDay: true,
        resource: task.priority,
      }))
    setEvents(taskEvents)
  }, [tasks])

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3174ad"
    switch (event.resource) {
      case "high":
        backgroundColor = "#dc2626"
        break
      case "medium":
        backgroundColor = "#f59e0b"
        break
      case "low":
        backgroundColor = "#10b981"
        break
    }
    return { style: { backgroundColor } }
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["month"]}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  )
}

