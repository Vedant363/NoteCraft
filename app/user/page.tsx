"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "../../lib/supabase"
import { toast } from "sonner"
import { AvatarPicker } from "../components/AvatarPicker"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { AuthError } from "@supabase/supabase-js"

export default function UserProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  useEffect(() => {
    if (!user && !loading) {
      router.push("/")
    }
    if (user) {
      setFullName(user.user_metadata?.full_name || "")
      setAvatarUrl(user.user_metadata?.avatar_url || "/avatars/avatar1.png")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl },
      })
      if (error) throw error
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
      console.error("Error updating profile:", error)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPasswordError("New password must contain at least one uppercase letter, one lowercase letter, and one number")
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast.success("Password updated successfully")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      router.push("/")
    } catch (error) {
      console.error("Error updating password:", error)
      if (error instanceof AuthError) {
        switch (error.message) {
          case "Invalid login credentials":
            setPasswordError("Current password is incorrect")
            break
          case "New password should be different from the old password":
            setPasswordError("New password must be different from the current password")
            break
          default:
            setPasswordError(error.message)
        }
      } else {
        setPasswordError("An unexpected error occurred. Please try again.")
      }
      toast.error("Failed to update password")
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label>Avatar</Label>
          <AvatarPicker selectedAvatar={avatarUrl} onSelect={setAvatarUrl} />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div className="relative">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type={showPasswords.currentPassword ? "text" : "password"}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-7"
            onClick={() => togglePasswordVisibility("currentPassword")}
          >
            {showPasswords.currentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="relative">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type={showPasswords.newPassword ? "text" : "password"}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-7"
            onClick={() => togglePasswordVisibility("newPassword")}
          >
            {showPasswords.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="relative">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type={showPasswords.confirmPassword ? "text" : "password"}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-7"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {showPasswords.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {passwordError && <p className="text-red-500">{passwordError}</p>}
        <Button type="submit">Change Password</Button>
      </form>
    </div>
  )
}

