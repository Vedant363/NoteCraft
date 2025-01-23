'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Fuse from 'fuse.js'
import { useNotes } from '../hooks/useNotes'
import { useTasks } from '../hooks/useTasks'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { notes, setSelectedNoteId } = useNotes()
  const { tasks, setSelectedTaskId } = useTasks()

  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string; type: 'note' | 'task' }>>([])

  useEffect(() => {
    const options = {
      keys: ['title', 'content'],
      threshold: 0.3,
    }

    const notesFuse = new Fuse(notes, options)
    const tasksFuse = new Fuse(tasks, options)

    if (searchQuery) {
      const filteredNotes = notesFuse.search(searchQuery).map(result => ({ ...result.item, type: 'note' as const }))
      const filteredTasks = tasksFuse.search(searchQuery).map(result => ({ ...result.item, type: 'task' as const }))
      setSearchResults([...filteredNotes, ...filteredTasks])
    } else {
      setSearchResults([])
    }
  }, [searchQuery, notes, tasks])

  const handleResultClick = (id: string, type: 'note' | 'task') => {
    if (type === 'note') {
      setSelectedNoteId(id)
      router.push(`/notes/${id}`)
    } else {
      setSelectedTaskId(id)
      router.push(`/tasks/${id}`)
    }
    setSearchQuery('')
  }

  return (
    <div className="p-4">
      <Input 
        placeholder="Search notes and tasks..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Search Results:</h3>
          <div className="space-y-2">
            {searchResults.map(result => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleResultClick(result.id, result.type)}
              >
                {result.title} ({result.type})
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

