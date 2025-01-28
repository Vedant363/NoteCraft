"use client"

import { useState, useEffect } from "react"
import { useNotes } from "../hooks/useNotes"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export function NoteEditor() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const { addNote, updateNote, selectedNoteId, setSelectedNoteId, notes } = useNotes()

  useEffect(() => {
    if (selectedNoteId) {
      const selectedNote = notes.find((note) => note.id === selectedNoteId)
      if (selectedNote) {
        setTitle(selectedNote.title)
        setContent(selectedNote.content)
      }
    } else {
      const savedTitle = localStorage.getItem("draftNoteTitle")
      const savedContent = localStorage.getItem("draftNoteContent")
      if (savedTitle) setTitle(savedTitle)
      if (savedContent) setContent(savedContent)
    }
  }, [selectedNoteId, notes])

  useEffect(() => {
    if (!selectedNoteId) {
      localStorage.setItem("draftNoteTitle", title)
      localStorage.setItem("draftNoteContent", content)
    }
  }, [title, content, selectedNoteId])

  const handleSave = async () => {
    if (title.trim() || content.trim()) {
      if (selectedNoteId) {
        await updateNote({
          id: selectedNoteId,
          title,
          content,
        })
      } else {
        await addNote({
          title,
          content,
          tags: [],
        })
      }
      setSelectedNoteId(null)
      setTitle("")
      setContent("")
      localStorage.removeItem("draftNoteTitle")
      localStorage.removeItem("draftNoteContent")

      // Quick bounce through temp page
      router.push("/temp")
    }
  }

  return (
    <div className="flex-1 p-4 space-y-4 max-w-3xl mx-auto">
      {selectedNoteId && (
        <Button variant="ghost" onClick={() => setSelectedNoteId(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Button>
      )}
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content (Markdown supported)"
            className="h-[calc(100vh-300px)] resize-none"
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="w-full h-[calc(100vh-300px)] border rounded-md p-4 prose dark:prose-invert overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
      <Button onClick={handleSave} className="border border-gray-300">Save Note</Button>
    </div>
  )
}

