"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "@/components/ColorPicker"
import { UndoRedo } from "@/components/UndoRedo"
import { Save, Square, Circle, Triangle } from "lucide-react"
import drawingApp from "@/components/DrawingApp"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

type Tool = "pen" | "eraser" | "square" | "circle" | "triangle"

const DrawingApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState<Tool>("pen")
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const [lastDrawnShape, setLastDrawnShape] = useState<ImageData | null>(null)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [filename, setFilename] = useState("drawing")

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext("2d")
      if (context) {
        setCtx(context)
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        const initialState = context.getImageData(0, 0, canvas.width, canvas.height)
        setHistory([initialState])
        setHistoryIndex(0)
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas && ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        ctx.putImageData(imageData, 0, 0)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [ctx])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx) {
      const { offsetX, offsetY } = e.nativeEvent
      ctx.beginPath()
      ctx.moveTo(offsetX, offsetY)
      setIsDrawing(true)
      setStartPos({ x: offsetX, y: offsetY })

      // Save the current canvas state before starting to draw a new shape
      if (["square", "circle", "triangle"].includes(tool)) {
        setLastDrawnShape(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height))
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !startPos) return
    const { offsetX, offsetY } = e.nativeEvent

    if (tool === "pen") {
      ctx.lineTo(offsetX, offsetY)
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      ctx.stroke()
    } else if (tool === "eraser") {
      const eraserSize = brushSize * 2
      ctx.globalCompositeOperation = "destination-out"
      ctx.beginPath()
      ctx.arc(offsetX, offsetY, eraserSize, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.globalCompositeOperation = "source-over"
    } else {
      // For shapes, we'll preview them while drawing
      if (lastDrawnShape) {
        ctx.putImageData(lastDrawnShape, 0, 0)
      }
      drawShape(offsetX, offsetY, true)
    }
  }

  const drawShape = (endX: number, endY: number, isPreview = false) => {
    if (!ctx || !startPos) return

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize

    if (isPreview) {
      ctx.setLineDash([5, 5]) // Set a dashed line for preview
    } else {
      ctx.setLineDash([]) // Reset to solid line for final shape
    }

    const width = endX - startPos.x
    const height = endY - startPos.y

    switch (tool) {
      case "square":
        ctx.rect(startPos.x, startPos.y, width, height)
        break
      case "circle":
        const centerX = startPos.x + width / 2
        const centerY = startPos.y + height / 2
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        break
      case "triangle":
        ctx.moveTo(startPos.x + width / 2, startPos.y)
        ctx.lineTo(startPos.x, startPos.y + height)
        ctx.lineTo(startPos.x + width, startPos.y + height)
        ctx.closePath()
        break
    }

    ctx.stroke()
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx && isDrawing) {
      if (["square", "circle", "triangle"].includes(tool)) {
        const { offsetX, offsetY } = e.nativeEvent
        if (lastDrawnShape) {
          ctx.putImageData(lastDrawnShape, 0, 0)
        }
        drawShape(offsetX, offsetY)
      }
      ctx.closePath()
      setIsDrawing(false)
      setStartPos(null)
      setLastDrawnShape(null)
      saveToHistory()
    }
  }

  const saveToHistory = () => {
    if (ctx && canvasRef.current) {
      const canvas = canvasRef.current
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(currentState)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      saveToHistory()
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      const imageData = history[historyIndex - 1]
      ctx?.putImageData(imageData, 0, 0)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      const imageData = history[historyIndex + 1]
      ctx?.putImageData(imageData, 0, 0)
    }
  }

  const saveAsImage = () => {
    setIsSaveDialogOpen(true)
  }

  const handleSave = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `${filename}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
      setIsSaveDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setTool("pen")} variant={tool === "pen" ? "default" : "outline"}>
          Pen
        </Button>
        <Button onClick={() => setTool("eraser")} variant={tool === "eraser" ? "default" : "outline"}>
          Eraser
        </Button>
        <Button onClick={() => setTool("square")} variant={tool === "square" ? "default" : "outline"}>
          <Square className="h-4 w-4" />
        </Button>
        <Button onClick={() => setTool("circle")} variant={tool === "circle" ? "default" : "outline"}>
          <Circle className="h-4 w-4" />
        </Button>
        <Button onClick={() => setTool("triangle")} variant={tool === "triangle" ? "default" : "outline"}>
          <Triangle className="h-4 w-4" />
        </Button>
        <ColorPicker color={color} onChange={setColor} />
        <div className="flex items-center gap-2">
          <span>Size:</span>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={50}
            step={1}
            className="w-[100px]"
          />
        </div>
        <Button onClick={clearCanvas}>Clear</Button>
        <UndoRedo onUndo={undo} onRedo={redo} />
        <Button onClick={saveAsImage}>
          <Save className="mr-2 h-4 w-4" /> Save As
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="border border-gray-300 rounded-md w-full h-[32.25rem]"
      />
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Drawing</DialogTitle>
          </DialogHeader>
          <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="Enter filename" />
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function DrawPage() {
  return <DrawingApp />
}

