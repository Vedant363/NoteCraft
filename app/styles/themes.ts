export const themes = {
  light: {
    default: {
      name: "Light",
      colors: {
        background: "0 0% 100%",
        foreground: "222.2 84% 4.9%",
        primary: "222.2 47.4% 11.2%",
        secondary: "210 40% 96.1%",
        muted: "210 40% 96.1%",
        accent: "210 40% 96.1%",
      },
    },
    forest: {
      name: "Forest Light",
      colors: {
        background: "120 50% 95%",
        foreground: "120 80% 5%",
        primary: "120 100% 25%",
        secondary: "120 30% 85%",
        muted: "120 30% 85%",
        accent: "120 100% 35%",
      },
    },
    ocean: {
      name: "Ocean Light",
      colors: {
        background: "200 50% 95%",
        foreground: "200 80% 5%",
        primary: "200 100% 35%",
        secondary: "200 30% 85%",
        muted: "200 30% 85%",
        accent: "200 100% 45%",
      },
    },
    sunset: {
      name: "Sunset Light",
      colors: {
        background: "30 50% 95%",
        foreground: "30 80% 5%",
        primary: "30 100% 45%",
        secondary: "30 30% 85%",
        muted: "30 30% 85%",
        accent: "30 100% 55%",
      },
    },
    lavender: {
      name: "Lavender Light",
      colors: {
        background: "270 50% 95%",
        foreground: "270 80% 5%",
        primary: "270 100% 45%",
        secondary: "270 30% 85%",
        muted: "270 30% 85%",
        accent: "270 100% 55%",
      },
    },
  },
  dark: {
    default: {
      name: "Dark",
      colors: {
        background: "222.2 84% 4.9%",
        foreground: "0 0% 100%",
        primary: "0 0% 0%",
        secondary: "217.2 32.6% 17.5%",
        muted: "217.2 32.6% 17.5%",
        accent: "217.2 32.6% 17.5%",
      },
    },
    forest: {
      name: "Forest Dark",
      colors: {
        background: "120 50% 5%",
        foreground: "120 30% 90%",
        primary: "120 100% 35%",
        secondary: "120 30% 15%",
        muted: "120 30% 15%",
        accent: "120 100% 45%",
      },
    },
    ocean: {
      name: "Ocean Dark",
      colors: {
        background: "200 50% 5%",
        foreground: "200 30% 90%",
        primary: "200 100% 45%",
        secondary: "200 30% 15%",
        muted: "200 30% 15%",
        accent: "200 100% 55%",
      },
    },
    sunset: {
      name: "Sunset Dark",
      colors: {
        background: "30 50% 5%",
        foreground: "30 30% 90%",
        primary: "30 100% 55%",
        secondary: "30 30% 15%",
        muted: "30 30% 15%",
        accent: "30 100% 65%",
      },
    },
    lavender: {
      name: "Lavender Dark",
      colors: {
        background: "270 50% 5%",
        foreground: "270 30% 90%",
        primary: "270 100% 55%",
        secondary: "270 30% 15%",
        muted: "270 30% 15%",
        accent: "270 100% 65%",
      },
    },
  },
}

export type ThemeMode = "light" | "dark"
export type ThemeName = keyof typeof themes.light | keyof typeof themes.dark
export type Theme = {
  mode: ThemeMode | "system"
  name: ThemeName
}

