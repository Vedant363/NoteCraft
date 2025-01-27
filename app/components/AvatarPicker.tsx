import { useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const avatarOptions = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
]

interface AvatarPickerProps {
  selectedAvatar: string
  onSelect: (avatar: string) => void
}

export function AvatarPicker({ selectedAvatar, onSelect }: AvatarPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {avatarOptions.map((avatar, index) => (
        <Button
          key={index}
          variant="outline"
          className={`p-1 ${selectedAvatar === avatar ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelect(avatar)}
        >
          <Avatar>
            <AvatarImage src={avatar} alt={`Avatar option ${index + 1}`} />
          </Avatar>
        </Button>
      ))}
    </div>
  )
}

