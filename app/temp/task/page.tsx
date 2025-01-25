// app/temp/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TempPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/tasks")
  }, [router])

  return null
}

