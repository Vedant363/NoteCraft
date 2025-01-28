import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { themes, type ThemeMode, type ThemeName, Theme } from "../styles/themes"
import { useTheme } from "./ThemeProvider"
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react"

export function ThemePicker() {
  const { theme, changeTheme } = useTheme()
  const [selectedMode, setSelectedMode] = useState<ThemeMode | "system">("system")

  const currentTheme = theme ? (theme.split("-") as [ThemeMode, ThemeName]) : ["system", "default"]

  const handleThemeChange = (mode: ThemeMode | "system", name: ThemeName = "default") => {
    if (mode === "system") {
      changeTheme({ mode: "system", name: "default" })
    } else {
      changeTheme({ mode, name })
    }
    setSelectedMode(mode)
  }

  const renderThemeOptions = (mode: ThemeMode) => (
 <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <span>{themes[mode][currentTheme[1]].name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {Object.entries(themes[mode]).map(([name, themeObj]) => (
          <DropdownMenuItem 
            key={name} 
            onSelect={() => handleThemeChange(mode, name)}
          >
            {themeObj.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          variant={selectedMode === "system" ? "default" : "outline"}
          size="icon"
          onClick={() => handleThemeChange("system")}
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={selectedMode === "light" ? "default" : "outline"}
          size="icon"
          onClick={() => handleThemeChange("light")}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant={selectedMode === "dark" ? "default" : "outline"}
          size="icon"
          onClick={() => handleThemeChange("dark")}
        >
          <Moon className="h-4 w-4" />
        </Button>
      </div>
      {selectedMode !== "system" && renderThemeOptions(selectedMode as ThemeMode)}
    </div>
  )
}

