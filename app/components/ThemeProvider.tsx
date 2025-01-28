"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { themes, type ThemeMode, type ThemeName, type Theme } from "../styles/themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      value={Object.keys(themes).flatMap((mode) =>
        Object.keys(themes[mode as ThemeMode]).map((name) => `${mode}-${name}`),
      )}
    >
      {children}
    </NextThemesProvider>
  )
}

import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const { theme, setTheme } = useNextTheme()

  const changeTheme = React.useCallback(
    (newTheme: Theme) => {
      if (newTheme.mode === "system") {
        setTheme("system")
      } else {
        setTheme(`${newTheme.mode}-${newTheme.name}`)
      }
      if (newTheme.mode !== "system") {
        const root = document.documentElement
        Object.entries(themes[newTheme.mode][newTheme.name].colors).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value)
        })
      }
    },
    [setTheme],
  )

  React.useEffect(() => {
    if (theme) {
      if (theme === "system") {
        changeTheme({ mode: "system", name: "default" })
      } else {
        const [mode, name] = theme.split("-") as [ThemeMode, ThemeName]
        if (themes[mode] && themes[mode][name]) {
          changeTheme({ mode, name })
        }
      }
    }
  }, [theme, changeTheme])

  return { theme, changeTheme }
}

