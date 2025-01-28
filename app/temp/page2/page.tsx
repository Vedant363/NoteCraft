"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TempPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const noteId = searchParams.get('noteId')
    if (noteId) {
      router.replace(`/notes/${noteId}`)
    }
  }, [router, searchParams])

  return null // This page won't render anything as it immediately redirects
}

