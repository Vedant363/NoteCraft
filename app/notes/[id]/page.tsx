"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useNotes } from "../../hooks/useNotes"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, Edit } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "../../components/CodeBlock"
import { EditNoteForm } from "../../components/EditNoteForm"

export default function NotePage() {
  const { id } = useParams()
  const router = useRouter()
  const { notes } = useNotes()
  const [note, setNote] = useState<{ title: string; content: string } | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    const foundNote = notes.find((n) => n.id === id)
    if (foundNote) {
      setStatus('')
      setNote(foundNote)
    }
  }, [id, notes])

  const copyToClipboard = async () => {
    if (note) {
      await navigator.clipboard.writeText(`${note.title}

${note.content}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  useEffect(() => {
    // Set initial status to 'Loading...'
    setStatus('Loading...');
    
    // After 5 seconds, set status to 'Task Not found'
    const timer = setTimeout(() => {
      setStatus('Note Not found');
    }, 5000);

    // Cleanup timer if the component is unmounted before 5 seconds
    return () => clearTimeout(timer);
  }, []);


  if (!note) {
    return <div>{status}</div>
  }

  return (
    <div className="p-4 md:ml-11">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
        <Button variant="ghost" onClick={() => router.push('/notes')} className="border border-gray-200">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notes
        </Button>
        <Button variant="outline" onClick={copyToClipboard} className="border border-gray-200">
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button variant="outline" onClick={() => setIsEditing(true)} className="border border-gray-200">
          <Edit className="mr-2 h-4 w-4" />
          Edit Note
        </Button>
      </div>
      <br />
      {isEditing ? (
        <EditNoteForm note={note} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-black-500 bg-gradient-to-r from-blue-500 to-cyan-500 inline-block px-2 py-1 rounded">
            {note.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <CodeBlock className={className} {...props}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  )
}

