import { useState, useEffect, useCallback } from "react"
import type { Task } from "../types"
import { supabase } from "../../lib/supabase"
import { useAuth } from "./useAuth"
import { addDays, isBefore } from "date-fns"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchTasks = useCallback(async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
    } else {
      setTasks(data || [])
    }
  }, [user])

  useEffect(() => {
    if (user) fetchTasks()
  }, [user, fetchTasks])

  async function addTask(task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">) {
    if (!user) return

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ ...task, user_id: user.id }])
      .select()

    if (error) {
      console.error("Error adding task:", error)
    } else if (data) {
      setTasks((prevTasks) => [data[0], ...prevTasks])
    }
  }

  async function updateTask(updatedTask: Partial<Task> & { id: string }) {
    if (!user) return

    const { error } = await supabase
      .from("tasks")
      .update({ ...updatedTask, updated_at: new Date().toISOString() })
      .eq("id", updatedTask.id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating task:", error)
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask, updated_at: new Date().toISOString() } : task,
        ),
      )
    }
  }

  async function deleteTask(id: string) {
    if (!user) return

    const taskToDelete = tasks.find((task) => task.id === id)
    if (!taskToDelete) return

    const { error: trashError } = await supabase.from("trash").insert([
      {
        id: taskToDelete.id,
        title: taskToDelete.title,
        type: "task",
        user_id: user.id,
        deleted_at: new Date().toISOString(),
        due_date: taskToDelete.due_date,
        completed: taskToDelete.completed,
        priority: taskToDelete.priority,
      },
    ])

    if (trashError) {
      console.error("Error moving task to trash:", trashError)
      return
    }

    const { error } = await supabase.from("tasks").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting task:", error)
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
      if (selectedTaskId === id) {
        setSelectedTaskId(null)
      }
    }
  }

  async function deleteAllTasks() {
    if (!user) return

    try {
      const { error } = await supabase.from("tasks").delete().eq("user_id", user.id)

      if (error) {
        throw error
      }

      setTasks([])
      setSelectedTaskId(null)
    } catch (error) {
      console.error("Error deleting all tasks:", error)
      throw error
    }
  }

  function getUpcomingTasks() {
    const now = new Date()
    const sevenDaysFromNow = addDays(now, 7)
    return tasks.filter(
      (task) => task.due_date && !task.completed && isBefore(new Date(task.due_date), sevenDaysFromNow),
    )
  }

  function markTaskAsCompleted(taskId: string, completed: boolean) {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))
  }

  return {
    tasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    selectedTaskId,
    setSelectedTaskId,
    getUpcomingTasks,
    markTaskAsCompleted,
  }
}

