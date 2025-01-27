import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthResult {
  success: boolean
  message?: string
  user?: User | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: undefined,  // Remove email redirect
          data: {
            email_confirmed: true  // Add custom claim
          }
        }
      })
      
      if (error) throw error

      // If sign up successful, immediately sign in
      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (signInError) throw signInError
      }

      setUser(data.user)
      return { 
        success: true, 
        message: "Sign up successful!",
        user: data.user 
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message }
      }
      return { success: false, message: "An unexpected error occurred" }
    } finally {
      setAuthLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setAuthLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      if (error) throw error
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message }
      }
      return { success: false, message: "An unexpected error occurred" }
    } finally {
      setAuthLoading(false)
    }
  }

  const signOut = async (): Promise<AuthResult> => {
    setAuthLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      return { success: true }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message }
      }
      return { success: false, message: "An unexpected error occurred" }
    } finally {
      setAuthLoading(false)
    }
  }

  return { user, loading: loading || authLoading, signUp, signIn, signOut }
}

