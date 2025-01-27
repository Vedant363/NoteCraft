"use client"

import { useAuth } from "../hooks/useAuth"
import { Search } from "../components/Search"
import { NotesList } from "../components/NotesList"
import { NoteEditor } from "../components/NoteEditor"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function NotesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // This will prevent a flash of content before redirecting
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="w-full md:w-64 bg-secondary p-0 overflow-y-auto overflow-x-hidden border-l border-gray-300">
        <Search />
        <NotesList />
      </aside>
      <main className="flex-1 p-4 overflow-y-auto border border-gray-300">
        <NoteEditor />
      </main>
    </div>
  )
}

