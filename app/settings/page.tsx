"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { useNotes } from "../hooks/useNotes"
import { useTasks } from "../hooks/useTasks"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { user, loading } = useAuth()
  const router = useRouter()
  const { deleteAllNotes } = useNotes()
  const { deleteAllTasks } = useTasks()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteType, setDeleteType] = useState<"notes" | "tasks" | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      if (deleteType === "notes") {
        await deleteAllNotes()
      } else if (deleteType === "tasks") {
        await deleteAllTasks()
      }
      setShowDialog(false)
      //alert(`All ${deleteType} deleted successfully`)
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error)
      alert(`Failed to delete ${deleteType}`)
    } finally {
      setIsDeleting(false)
      setDeleteType(null)
    }
  }

  const openDeleteDialog = (type: "notes" | "tasks") => {
    setDeleteType(type)
    setShowDialog(true)
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Data Management</h2>
        <div className="space-y-2">
          <Button 
            variant="destructive" 
            onClick={() => openDeleteDialog("notes")}
            disabled={isDeleting}
          >
            {isDeleting && deleteType === "notes" ? "Deleting..." : "Delete All Notes"}
          </Button>
          <div className="h-2" />
          <Button 
            variant="destructive" 
            onClick={() => openDeleteDialog("tasks")}
            disabled={isDeleting}
          >
            {isDeleting && deleteType === "tasks" ? "Deleting..." : "Delete All Tasks"}
          </Button>
        </div>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your {deleteType}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

