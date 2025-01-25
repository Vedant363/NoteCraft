"use client"

import { useState, useEffect } from "react"
import { useTasks } from "../hooks/useTasks"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, MoreHorizontal, CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "../types"

export function TaskList() {
  const router = useRouter()
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<"low" | "medium" | "high" | undefined>(undefined)
  const { tasks, addTask, updateTask, deleteTask, markTaskAsCompleted } = useTasks()

  useEffect(() => {
    const savedTaskTitle = localStorage.getItem("draftTaskTitle")
    if (savedTaskTitle) setNewTaskTitle(savedTaskTitle)
  }, [])

  useEffect(() => {
    localStorage.setItem("draftTaskTitle", newTaskTitle)
  }, [newTaskTitle])

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const newTask: Omit<Task, "id" | "created_at" | "updated_at" | "user_id"> = {
        title: newTaskTitle,
        completed: false,
      }
      if (dueDate) {
        newTask.due_date = dueDate.toISOString()
      }
      if (priority) {
        newTask.priority = priority
      }
      await addTask(newTask)
      setNewTaskTitle("")
      setDueDate(undefined)
      setPriority(undefined)
      localStorage.removeItem("draftTaskTitle")
      router.push("/temp/task")
    }
  }

  const resetOptions = () => {
    setDueDate(undefined)
    setPriority(undefined)
  }

  const navigateToTask = () => {
    router.push('/temp/task');
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Tasks</h2>
      <div className="flex space-x-2">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task"
          className="flex-grow"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Due Date</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Priority</h4>
                <Select onValueChange={(value: "low" | "medium" | "high" | undefined) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={resetOptions} variant="outline">
                Reset Options
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-2 bg-secondary p-2 rounded-md">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => {
                updateTask({ ...task, completed: checked as boolean })
                markTaskAsCompleted(task.id, checked as boolean)
                navigateToTask()
              }}
            />
            <span className={cn("flex-grow", task.completed && "line-through")}>{task.title}</span>
            <span className="text-sm text-muted-foreground">{format(new Date(task.created_at), "MMM d, yyyy")}</span>
            {task.due_date && (
              <span className="text-sm text-muted-foreground">
                Due: {format(new Date(task.due_date), "MMM d, yyyy")}
              </span>
            )}
            {task.priority && (
              <span
                className={cn("text-sm", {
                  "text-red-500": task.priority === "high",
                  "text-yellow-500": task.priority === "medium",
                  "text-green-500": task.priority === "low",
                })}
              >
                {task.priority}
              </span>
            )}
          <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        deleteTask(task.id); // Delete the task
        navigateToTask(); // Navigate to /temp/task after deleting
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

