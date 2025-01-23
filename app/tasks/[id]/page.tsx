'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTasks } from '../../hooks/useTasks'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from 'lucide-react'

export default function TaskPage() {
  const { id } = useParams()
  const router = useRouter()
  const { tasks, updateTask } = useTasks()
  const [task, setTask] = useState<{ id: string; title: string; completed: boolean } | null>(null)

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === id)
    if (foundTask) {
      setTask(foundTask)
    }
  }, [id, tasks])

  if (!task) {
    return <div>Task not found</div>
  }

  const handleToggleComplete = (checked: boolean) => {
    const updatedTask = { ...task, completed: checked }
    updateTask(updatedTask)
    setTask(updatedTask)
  }

  return (
    <div className="p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tasks
      </Button>
      <div className="flex items-center space-x-2">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
        />
        <h1 className={`text-2xl font-bold ${task.completed ? 'line-through' : ''}`}>{task.title}</h1>
      </div>
    </div>
  )
}

