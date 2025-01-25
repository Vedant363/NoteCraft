"use client"
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function TempPageContent() {
 const router = useRouter()
 const searchParams = useSearchParams()
 
 useEffect(() => {
   const taskId = searchParams.get('taskId')
   if (taskId) {
     router.replace(`/tasks/${taskId}`)
   }
 }, [router, searchParams])

 return null
}

export default function TempPage() {
 return (
   <Suspense fallback={<div>Loading...</div>}>
     <TempPageContent />
   </Suspense>
 )
}