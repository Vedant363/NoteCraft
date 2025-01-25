"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useNotes } from "../hooks/useNotes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Note } from "../types"

interface EditNoteFormProps {
  note: Note
  onCancel: () => void
}

export function EditNoteForm({ note, onCancel }: EditNoteFormProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const { updateNote } = useNotes()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateNote({ id: note.id, title, content })
    // Redirect to temporary page with note ID as query parameter
    router.push(`/temp/page2?noteId=${note.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 h-full">
      <Input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Edit Note title" 
        className="w-full" 
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Edit Note content"
        className="w-full h-[12.5rem] min-h-full resize-none"
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

