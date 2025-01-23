import { useState, useEffect } from "react"
import type { Note } from "../types"
import { supabase } from "../../lib/supabase"
import { useAuth } from "./useAuth"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchNotes()
  }, [user])

  async function fetchNotes() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching notes:", error)
    } else {
      setNotes(data || [])
    }
  }

  async function addNote(note: Omit<Note, "id" | "created_at" | "updated_at" | "user_id">) {
    if (!user) return

    const { data, error } = await supabase
      .from("notes")
      .insert([{ ...note, tags: note.tags || [], user_id: user.id }])
      .select()

    if (error) {
      console.error("Error adding note:", error)
    } else if (data) {
      setNotes((prevNotes) => [data[0], ...prevNotes])
    }
  }

  async function updateNote(updatedNote: Partial<Note> & { id: string }) {
    if (!user) return

    const { error } = await supabase
      .from("notes")
      .update({ ...updatedNote, updated_at: new Date().toISOString() })
      .eq("id", updatedNote.id)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating note:", error)
    } else {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? { ...note, ...updatedNote, updated_at: new Date().toISOString() } : note,
        ),
      )
    }
  }

  async function deleteNote(id: string) {
    if (!user) return

    const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting note:", error)
    } else {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
      if (selectedNoteId === id) {
        setSelectedNoteId(null)
      }
    }
  }

  async function deleteAllNotes() {
    if (!user) return

    try {
      const { error } = await supabase.from("notes").delete().eq("user_id", user.id)

      if (error) {
        throw error
      }

      setNotes([])
      setSelectedNoteId(null)
    } catch (error) {
      console.error("Error deleting all notes:", error)
      throw error
    }
  }

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
    selectedNoteId,
    setSelectedNoteId,
  }
}

