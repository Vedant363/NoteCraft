"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Auth } from "./Auth"
import { Notebook, Sparkles } from "lucide-react"

export function HomePage() {
  const [showAuth, setShowAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const sparkles = document.querySelectorAll(".sparkle")
      sparkles.forEach((sparkle) => {
        sparkle.classList.add("animate-sparkle")
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLoginClick = () => {
    setShowAuth(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Animated background shapes */}
      

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.div
          className="text-4xl sm:text-6xl font-bold text-white mb-4 flex items-center justify-center"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
         
          Welcome to NoteCraft
        </motion.div>
        <motion.p
          className="text-lg sm:text-xl text-white mb-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Organize your thoughts, capture your ideas, and boost your productivity
        </motion.p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleLoginClick}
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-100 transition-colors duration-300"
          >
            Get Started
            <Sparkles className="ml-2 w-5 h-5 sparkle" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full sparkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Auth modal */}
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <Auth onClose={() => setShowAuth(false)} />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

