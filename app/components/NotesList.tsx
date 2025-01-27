"use client"
import { useState, useEffect } from "react"
import { useNotes } from "../hooks/useNotes"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { EditNoteForm } from "./EditNoteForm"
import { NotesListSkeleton } from "./NotesListSkeleton"

export function NotesList() {
  const { notes, deleteNote, setSelectedNoteId } = useNotes()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading completion (replace with actual data fetching logic)
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <NotesListSkeleton />
  }

  return (
    <div className="w-full md:w-64 border-r">
      <Button
        variant="ghost"
        className="w-full justify-between items-center md:hidden p-4"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        Saved Notes
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>
      <div
        className={`${isCollapsed ? "hidden" : "block"} md:block p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-8rem)]`}
      >
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="flex flex-col">
              {editingNoteId === note.id ? (
                <EditNoteForm note={note} onCancel={() => setEditingNoteId(null)} />
              ) : (
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left truncate text-sm hover:bg-gray-200"
                    onClick={() => {
                      setSelectedNoteId(note.id)
                      router.push(`/notes/${note.id}`)
                    }}
                  >
                    {note.title}
                  </Button>
                  <div className="flex">
                    <Button className="hover:bg-gray-200" variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm text-center">No notes found</p>
        )}
      </div>
    </div>
  )
}

