"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Notebook, Loader2 } from "lucide-react"
import { ThemePicker } from "../components/ThemePicker"
import { themes, type ThemeMode, type ThemeName, Theme } from "../styles/themes"
import { useTheme } from "./ThemeProvider"

interface FormState {
  email: string
  password: string
}

export function Auth() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: ""
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { signIn, signUp, loading } = useAuth()

  const validateForm = (): boolean => {
    if (!formState.email || !formState.password) {
      setError("Please fill in all fields")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email)) {
      setError("Please enter a valid email address")
      return false
    }

    if (formState.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
    setSuccessMessage(null)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!validateForm()) return

    try {
      const result = isSignUp 
        ? await signUp(formState.email, formState.password)
        : await signIn(formState.email, formState.password)

      if (!result.success) {
        setError(result.message)
      } else {
        setSuccessMessage(isSignUp ? "Account created successfully!" : "Signed in successfully!")
        setFormState({ email: "", password: "" })
        // Add a small delay before redirect to show the success message
        setTimeout(() => {
          router.push('/notes')
        }, 500)
      }
    } catch (error) {
      setError("Authentication failed. Please try again.")
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setSuccessMessage(null)
    setFormState({ email: "", password: "" })
  }

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

  return (
    <>
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center justify-center">
          <Notebook className="mr-2 h-6 w-6" />
          NoteCraft
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="abc@email.com"
              value={formState.email}
              onChange={handleInputChange}
              disabled={loading}
              required
              className="bg-white placeholder:text-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleInputChange}
              disabled={loading}
              required
              className="bg-white placeholder:text-gray-300"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          onClick={handleAuth} 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            isSignUp ? "Sign Up" : "Sign In"
          )}
        </Button>
        <Button 
          variant="link" 
          className="w-full" 
          onClick={toggleAuthMode}
          disabled={loading}
        >
          {isSignUp 
            ? "Already have an account? Sign In" 
            : "Don't have an account? Sign Up"
          }
        </Button>
      </CardFooter>
    </Card>
    </>
  )
}

