"use client"

import React, { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
  children: string
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <pre className={className}>
      <button className="copy-button" onClick={copyToClipboard}>
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <code>{children}</code>
    </pre>
  )
}

