"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTasks } from "../../hooks/useTasks"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { CalendarIcon, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TaskPage() {
  const { id } = useParams()
  const router = useRouter()
  const { tasks, updateTask } = useTasks()
  const [status, setStatus] = useState('Loading...');
  const [task, setTask] = useState<{
    id: string
    title: string
    completed: boolean
    created_at: string
    due_date?: string
    priority?: "low" | "medium" | "high"
  } | null>(null)

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id)
    if (foundTask) {
      setStatus('')
      setTask(foundTask)
    }
  }, [id, tasks])

  useEffect(() => {
    // Set initial status to 'Loading...'
    setStatus('Loading...');
    
    // After 5 seconds, set status to 'Task Not found'
    const timer = setTimeout(() => {
      setStatus('Task Not found');
    }, 5000);

    // Cleanup timer if the component is unmounted before 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!task) {
    return <div>{status}</div>
  }

  const handleToggleComplete = (checked: boolean) => {
    const updatedTask = { ...task, completed: checked }
    updateTask(updatedTask)
    setTask(updatedTask)
    router.push(`/temp/page3?taskId=${id}`)
  }

  return (
    <div className="p-4 space-y-4">
      <Button
  className="border border-black-500 rounded-md mb-4"
  variant="ghost"
  onClick={() => router.push('/tasks')}
>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Back to Tasks
</Button>
      {task && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox checked={task.completed} onCheckedChange={handleToggleComplete} />
            <h1 className={cn("text-2xl font-bold", task.completed && "line-through")}>{task.title}</h1>
          </div>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Created: {format(new Date(task.created_at), "PPP")}</span>
            </div>
            {task.due_date && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Due: {format(new Date(task.due_date), "PPP")}</span>
              </div>
            )}
            {task.priority && (
              <div className="flex items-center space-x-2">
                <Flag
                  className={cn("h-4 w-4", {
                    "text-red-500": task.priority === "high",
                    "text-yellow-500": task.priority === "medium",
                    "text-green-500": task.priority === "low",
                  })}
                />
                <span className="capitalize">{task.priority} Priority</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

