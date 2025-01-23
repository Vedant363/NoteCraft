"use client"

import { useState } from "react"
import { useNotes } from "../hooks/useNotes"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"

export function NotesList() {
  const { notes, deleteNote, setSelectedNoteId } = useNotes()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
        {notes.map((note) => (
          <div key={note.id} className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="w-full justify-start text-left truncate text-sm"
              onClick={() => {
                setSelectedNoteId(note.id)
                router.push(`/notes/${note.id}`)
              }}
            >
              {note.title}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

