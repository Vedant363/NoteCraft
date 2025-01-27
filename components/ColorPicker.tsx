import type React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#ffff"]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-[60px] p-0">
          <div className="w-full h-full rounded border-4 border-blue-600" style={{ backgroundColor: color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="grid grid-cols-7 gap-2">
          {colors.map((c) => (
            <button
              key={c}
              className="w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full" />
      </PopoverContent>
    </Popover>
  )
}

