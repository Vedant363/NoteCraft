"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../hooks/useAuth"
import { supabase } from "../../lib/supabase"
import { Button } from "@/components/ui/button"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { Trash2, RefreshCw, FileText, CheckSquare } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface TrashItem {
  id: string
  title: string
  content?: string
  type: "note" | "task"
  deleted_at: string
  due_date?: string
  completed?: boolean
  priority?: "low" | "medium" | "high"
}

export function Trash() {
  const [trashItems, setTrashItems] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { user } = useAuth()

  const fetchTrashItems = useCallback(async () => {
    if (!user) {
      toast.error("User not authenticated")
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("trash")
        .select("*")
        .eq("user_id", user.id)
        .order("deleted_at", { ascending: false })

      if (error) throw error
      setTrashItems(data || [])
    } catch (error) {
      toast.error("Failed to fetch trash items")
      console.error("Error fetching trash items:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchTrashItems()
  }, [fetchTrashItems])

  const restoreItem = async (item: TrashItem) => {
    if (!user) {
      toast.error("User not authenticated")
      return
    }

    setIsLoading(true)
    try {
      await supabase.from("trash").delete().eq("id", item.id).throwOnError()

      const table = item.type === "note" ? "notes" : "tasks"
      const restoredItem: any = {
        id: item.id,
        title: item.title,
        user_id: user.id,
        ...(item.type === "note" ? { content: item.content } : {
          due_date: item.due_date,
          completed: item.completed,
          priority: item.priority
        })
      }

      await supabase.from(table).insert([restoredItem]).throwOnError()
      
      toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} restored`)
      fetchTrashItems()
    } catch (error) {
      toast.error(`Failed to restore ${item.type}`)
      console.error(`Error restoring item:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const emptyTrash = async () => {
    if (!user) {
      toast.error("User not authenticated")
      return
    }

    setIsLoading(true)
    try {
      await supabase.from("trash").delete().eq("user_id", user.id).throwOnError()
      toast.success("Trash emptied")
      setTrashItems([])
      setShowDialog(false)
    } catch (error) {
      toast.error("Failed to empty trash")
      console.error("Error emptying trash:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openEmptyTrashDialog = () => {
    setShowDialog(true)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trash</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={fetchTrashItems} 
            variant="outline" 
            size="icon" 
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {trashItems.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={openEmptyTrashDialog}
              disabled={isLoading}
            >
              {isLoading ? "Emptying..." : "Empty Trash"}
            </Button>
          )}
        </div>
      </div>
      
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all items in your trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={emptyTrash}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading ? (
        <p>Loading...</p>
      ) : trashItems.length === 0 ? (
        <p>No items in trash</p>
      ) : (
        <ul className="space-y-2">
          {trashItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
              <div className="flex items-center space-x-2">
                {item.type === "note" ? <FileText className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
                <span>{item.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Deleted: {format(new Date(item.deleted_at), "MMM d, yyyy")}
                </span>
                <Button 
                  className="hover:bg-gray-400"
                  onClick={() => restoreItem(item)} 
                  variant="ghost" 
                  size="sm" 
                  disabled={isLoading}
                >
                  Restore
                </Button>
                
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

