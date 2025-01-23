"use client"

import { useState, useEffect } from "react"
import { useTasks } from "../hooks/useTasks"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function TaskList() {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const { tasks, addTask, updateTask, deleteTask } = useTasks()

  useEffect(() => {
    const savedTaskTitle = localStorage.getItem("draftTaskTitle")
    if (savedTaskTitle) setNewTaskTitle(savedTaskTitle)
  }, [])

  useEffect(() => {
    localStorage.setItem("draftTaskTitle", newTaskTitle)
  }, [newTaskTitle])

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await addTask({
        title: newTaskTitle,
        completed: false,
        priority: "medium",
      })
      setNewTaskTitle("")
      localStorage.removeItem("draftTaskTitle")
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Tasks</h2>
      <div className="flex space-x-2">
        <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="New task" />
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => updateTask({ ...task, completed: checked as boolean })}
            />
            <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

