import type React from "react"
import { Button } from "@/components/ui/button"
import { Undo, Redo } from "lucide-react"

interface UndoRedoProps {
  onUndo: () => void
  onRedo: () => void
}

export const UndoRedo: React.FC<UndoRedoProps> = ({ onUndo, onRedo }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onUndo} size="icon">
        <Undo className="h-4 w-4" />
      </Button>
      <Button onClick={onRedo} size="icon">
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  )
}

