"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toggleMuted } from "@/lib/sounds"

const MuteToggle = () => {
  const [muted, setMuted] = useState(false)

  const handleToggle = () => {
    const val = toggleMuted()
    setMuted(val)
  }

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      tabIndex={0}
      className="fixed top-5 right-5 z-[200] w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#fefefe]/60 hover:text-[#fefefe] hover:bg-white/[0.08] transition-colors cursor-pointer backdrop-blur-sm"
    >
      {muted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </motion.button>
  )
}

export default MuteToggle
